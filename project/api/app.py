from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
import openai
import os
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load Firebase Admin SDK credentials from JSON file in project root directory
import pathlib
import sys
project_root = pathlib.Path(__file__).parent.parent.resolve()
cred_path = project_root / 'attt-f09c4-firebase-adminsdk-fbsvc-644355e9cb.json'

try:
    if cred_path.exists():
        print(f"Loading Firebase credentials from JSON file: {cred_path}", file=sys.stderr)
        cred = credentials.Certificate(str(cred_path))
    else:
        print("JSON credential file not found, loading from environment variables", file=sys.stderr)
        cred_dict = {
            "type": os.getenv("FIREBASE_TYPE"),
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n') if os.getenv("FIREBASE_PRIVATE_KEY") else None,
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
            "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
            "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
            "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN")
        }
        print(f"Credential dict loaded: {cred_dict}", file=sys.stderr)
        cred = credentials.Certificate(cred_dict)

    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase Admin SDK initialized successfully", file=sys.stderr)
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}", file=sys.stderr)
    raise e

@app.route('/api/articles', methods=['GET'])
def get_articles():
    """Get all articles from Firestore, optionally filtered by category"""
    try:
        category = request.args.get('category', '').strip().lower()
        articles_ref = db.collection('articles')
        if category:
            # Query Firestore for articles with matching category (case-insensitive)
            query = articles_ref.where('category', '==', category)
            docs = query.stream()
        else:
            docs = articles_ref.stream()
        articles = []
        for doc in docs:
            article = doc.to_dict()
            article['id'] = doc.id
            articles.append(article)
        return jsonify(articles)
    except Exception as e:
        print(f"Error fetching articles: {str(e)}")
        return jsonify({'error': 'Failed to fetch articles'}), 500

# ... rest of the routes unchanged ...

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user data by user ID"""
    try:
        user_doc = db.collection('users').document(user_id).get()
        if user_doc.exists:
            return jsonify(user_doc.to_dict())
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"Error getting user: {str(e)}")
        return jsonify({'error': 'Failed to get user'}), 500

@app.route('/api/users', methods=['POST'])
def add_or_update_user():
    """Add or update user preferences, username, and email"""
    try:
        data = request.json
        user_id = data.get('userId')
        email = data.get('email')
        preferences = data.get('preferences', {})
        username = data.get('username') or email
        
        if not user_id or not email:
            return jsonify({'error': 'Missing userId or email'}), 400
        
        # Map preferences keys to match Firebase structure
        mapped_preferences = {
            'preferred_category': preferences.get('preferred_category', ''),
            'preferred_length': preferences.get('preferred_length', ''),
            'preferred_tone': preferences.get('preferred_tone', ''),
            'wants_trending': preferences.get('wants_trending', True)
        }
        
        user_ref = db.collection('users').document(user_id)
        user_ref.set({
            'email': email,
            'username': username,
            'preferred_category': mapped_preferences['preferred_category'],
            'preferred_length': mapped_preferences['preferred_length'],
            'preferred_tone': mapped_preferences['preferred_tone'],
            'wants_trending': mapped_preferences['wants_trending'],
            'updatedAt': firestore.SERVER_TIMESTAMP
        }, merge=True)
        
        return jsonify({'success': True})
    except Exception as e:
        print(f"Error adding/updating user: {str(e)}")
        return jsonify({'error': 'Failed to add/update user'}), 500

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """Return recommended articles based on user preferences and topic"""
    try:
        data = request.json
        user_id = data.get('userId')
        preferences = data.get('preferences', {})
        articles = data.get('articles', [])
        topic = data.get('topic', '').lower()

        print(f"Recommendation request received: userId={user_id}, preferences={preferences}, articlesCount={len(articles)}, topic={topic}")

        if not user_id or not preferences or not articles:
            return jsonify({'error': 'Missing userId, preferences, or articles'}), 400

        preferred_category = preferences.get('preferred_category', '').lower()
        preferred_tone = preferences.get('preferred_tone', '').lower()
        preferred_length = preferences.get('preferred_length', '').lower()
        wants_trending = preferences.get('wants_trending', True)

        # Filter articles based on preferences and topic with improved matching
        filtered_articles = []
        for article in articles:
            article_category = article.get('category', '').lower()
            article_tone = article.get('tone', '').lower() if 'tone' in article else ''
            article_length = article.get('length', '').lower() if 'length' in article else ''
            article_trending = article.get('trending', False)
            article_title = article.get('title', '').lower()
            article_summary = article.get('summary', '').lower()

            # Filter by preferences with partial matching and ignoring empty preferences
            if preferred_category and preferred_category not in article_category:
                continue
            if preferred_tone and article_tone and preferred_tone not in article_tone:
                continue
            if preferred_length and article_length and preferred_length not in article_length:
                continue
            if wants_trending and not article_trending:
                continue

            # Filter by topic if provided - improved matching with word boundaries
            if topic:
                topic_lower = topic.lower()
                # Strict match: article category must exactly match the topic or topic in title/summary
                if not (
                    topic_lower == article_category or
                    topic_lower in article_title.split() or
                    topic_lower in article_summary.split()
                ):
                    continue

            filtered_articles.append(article)

        # If no articles matched, fallback to some articles ignoring preferences
        if not filtered_articles:
            filtered_articles = articles[:5]

        # Limit recommendations to top 5
        recommendations = filtered_articles[:5]

        print(f"Recommendations generated: {len(recommendations)} articles")

        return jsonify({'recommendations': recommendations})
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}")
        return jsonify({'error': 'Failed to generate recommendations'}), 500

@app.route('/api/recommendations', methods=['GET'])
def recommendations_get():
    return jsonify({'message': 'Use POST method to get recommendations'}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
