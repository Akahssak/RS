import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useArticles, Article } from '../hooks/useArticles';
import ArticleCard from '../components/ArticleCard';
import LoadingScreen from '../components/LoadingScreen';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const {
    articles,
    recommendedArticles,
    discoverNewArticles,
    loadingArticles,
    loadingRecommendations,
    error,
    refreshRecommendations,
  } = useArticles(category);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showAnalyzing, setShowAnalyzing] = useState(true);
  const analyzingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Extract unique categories from articles
    const uniqueCategories = Array.from(new Set(articles.map((article: Article) => article.category))).filter(Boolean);
    console.log('Unique categories:', uniqueCategories);
    setCategories(uniqueCategories);
  }, [articles]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setShowAnalyzing(true);
    debounceTimeout.current = setTimeout(async () => {
      setRefreshing(true);
      await refreshRecommendations(category || undefined);
      setRefreshing(false);
    }, 500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      if (analyzingTimeout.current) {
        clearTimeout(analyzingTimeout.current);
      }
    };
  }, [category, refreshRecommendations]);

  useEffect(() => {
    if (refreshing) {
      setShowAnalyzing(true);
      if (analyzingTimeout.current) {
        clearTimeout(analyzingTimeout.current);
      }
      analyzingTimeout.current = setTimeout(() => {
        setShowAnalyzing(false);
      }, 5000);
    }
  }, [refreshing]);

  useEffect(() => {
    console.log('Updating filtered recommendations after refresh or category change');
    setFilteredRecommendations(recommendedArticles.slice(0, 4));
  }, [recommendedArticles]);

  const username = user?.email?.split('@')[0] || 'Reader';

  return (
    <div className="animate-fade-in p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-primary-900 mb-2">
          Welcome back, <span className="text-primary-600">{username}</span>
        </h1>
        <p className="text-neutral-700 max-w-3xl">
          Here are your personalized article recommendations. Select a category to filter.
        </p>
      </div>

      <div className="mb-8 flex items-center gap-4">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat: string) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary-900 mb-6">Recommended For You</h2>
        {(loadingRecommendations || refreshing) && showAnalyzing ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-primary-600 font-semibold">Analyzing your preferences...</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-primary-600 h-2.5 rounded-full animate-progress" style={{ width: '100%', animationDuration: '3s' }}></div>
            </div>
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecommendations.map((article: Article) => (
              <ArticleCard key={article.id} article={article} isRecommended />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-600">
            No recommended articles available. Try adjusting your preferences or select a different category.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-primary-900 mb-6">Discover Something New</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {discoverNewArticles.map((article: Article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
