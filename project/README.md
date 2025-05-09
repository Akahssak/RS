# ArticleSync - Personalized Article Recommendations

A web application that provides personalized article recommendations based on user preferences using Firebase Authentication, Firestore database, and Python backend with LLM integration.

## Features

- User authentication (signup/login) with Firebase Authentication
- User preference collection and storage in Firestore
- Personalized article recommendations based on user preferences
- Rating system for articles
- Responsive design for all devices

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Flask with Python
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Recommendations:** OpenAI integration (or local LLM)

## Project Structure

```
article-recommender/
├── src/                  # React frontend code
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Application pages
│   ├── firebase/         # Firebase configuration
│   └── ...
├── api/                  # Flask backend code
│   ├── app.py            # Main Flask application
│   └── ...
├── public/               # Static assets
└── ...
```

## Setup Instructions

### Prerequisites

- Node.js and npm
- Python 3.10+
- Firebase account

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Update Firebase configuration in `src/firebase/config.ts` with your Firebase project details
4. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the api directory:
   ```
   cd api
   ```
2. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables:
   - Create a `.env` file in the `api` directory
   - Add your OpenAI API key: `OPENAI_API_KEY=your_key_here`
   - Add your Firebase credentials

4. Start the Flask server:
   ```
   python app.py
   ```

### Firebase Setup

1. Create a new Firebase project in the Firebase console
2. Enable Email/Password authentication
3. Create Firestore database with the following collections:
   - `users`: User preferences
   - `articles`: Article data
   - `ratings`: User ratings

## Deployment

### Frontend Deployment

1. Build the React application:
   ```
   npm run build
   ```
2. Deploy the `dist` directory to your hosting provider

### Backend Deployment

1. Deploy the Flask application to a Python-compatible hosting platform
2. Set environment variables on your hosting platform

## License

MIT