import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './useAuth';

export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  category: string;
  imageUrl?: string;
}

export interface RatingData {
  userId: string;
  articleId: string;
  rating: number;
  timestamp: Date;
}

export const useArticles = (category?: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [recommendedArticles, setRecommendedArticles] = useState<Article[]>([]);
  const [discoverNewArticles, setDiscoverNewArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, preferences } = useAuth();

  const fetchArticles = async () => {
    console.log('fetchArticles called');
    setLoadingArticles(true);
    setError(null);

    try {
      console.log('Fetching articles from backend');
      // Pass category as query parameter to fetch filtered articles from backend
      const params = category ? { category: category.toLowerCase() } : {};
      const response = await axios.get('/api/articles', { params, timeout: 10000 });
      const articlesList = response.data;

      console.log('Articles fetched from backend:', articlesList);

      setArticles(articlesList);

      const categoriesSet = new Set<string>();
      const discoverNew: Article[] = [];
      for (const article of articlesList) {
        if (!categoriesSet.has(article.category) && discoverNew.length < 4) {
          categoriesSet.add(article.category);
          discoverNew.push(article);
        }
        if (discoverNew.length >= 4) break;
      }
      setDiscoverNewArticles(discoverNew);

      // Initial recommendations without calling API
      if (user && preferences) {
        console.log('User and preferences available, preparing category-wise recommendations');
        const categoryMap: { [key: string]: Article[] } = {};
        for (const article of articlesList) {
          if (!categoryMap[article.category]) {
            categoryMap[article.category] = [];
          }
          categoryMap[article.category].push(article);
        }
        const recommended: Article[] = [];
        Object.values(categoryMap).forEach(categoryArticles => {
          recommended.push(...categoryArticles.slice(0, 2));
        });
        setRecommendedArticles(recommended);
      } else {
        console.log('User or preferences not available, skipping recommendations');
        const shuffled = [...articlesList].sort(() => 0.5 - Math.random());
        setRecommendedArticles(shuffled.slice(0, 4));
      }
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.response?.data?.error || 'Failed to load articles. Please try again later.');
      setRecommendedArticles([]);
      setDiscoverNewArticles([]);
    } finally {
      setLoadingArticles(false);
      console.log('fetchArticles finished, loadingArticles set to false');
    }
  };

  const getRecommendations = async (articlesList: Article[], topic?: string) => {
    if (!user || !preferences) {
      console.log('getRecommendations skipped: user or preferences missing');
      return;
    }

    setLoadingRecommendations(true);
    try {
      console.log('Sending recommendation request with:', {
        userId: user.uid,
        preferences,
        articlesCount: articlesList.length,
        topic
      });
      // Limit articles sent to recommendation API to max 20 for performance
      const limitedArticles = articlesList.slice(0, 20);
      const response = await axios.post('/api/recommendations', {
        userId: user.uid,
        preferences,
        articles: limitedArticles,
        topic
      });

      console.log('Recommendation API response:', response.data);

      if (response.data && response.data.recommendations) {
        // Limit to 4 articles
        setRecommendedArticles(response.data.recommendations.slice(0, 4));
        console.log('Updated recommendedArticles:', response.data.recommendations);
      } else {
        console.warn('No recommendations found in response data');
        setRecommendedArticles([]);
      }
    } catch (err: any) {
      console.error('Error getting recommendations:', err);
      // Fallback to random recommendations if API fails
      const shuffled = [...articlesList].sort(() => 0.5 - Math.random());
      setRecommendedArticles(shuffled.slice(0, 4));
    } finally {
      setLoadingRecommendations(false);
      console.log('getRecommendations finished, loadingRecommendations set to false');
    }
  };

  const getArticleById = (id: string): Article | undefined => {
    return articles.find(article => article.id === id);
  };

  const rateArticle = async (articleId: string, rating: number) => {
    if (!user) return;

    const ratingData: RatingData = {
      userId: user.uid,
      articleId,
      rating,
      timestamp: new Date()
    };

    try {
      await axios.post('/api/ratings', ratingData);
      return true;
    } catch (err) {
      console.error('Error rating article:', err);
      return false;
    }
  };

  useEffect(() => {
    console.log('useArticles useEffect triggered with user:', user, 'preferences:', preferences);
    fetchArticles();
  }, [user, preferences]);

  useEffect(() => {
    console.log('useArticles useEffect triggered with category:', category);
    fetchArticles();
  }, [category]);

  return {
    articles,
    recommendedArticles,
    discoverNewArticles,
    loadingArticles,
    loadingRecommendations,
    error,
    getArticleById,
    rateArticle,
    refreshRecommendations: (topic?: string) => getRecommendations(articles, topic)
  };
};
