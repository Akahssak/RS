import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, User, Calendar, ThumbsUp } from 'lucide-react';
import { useArticles } from '../hooks/useArticles';
import StarRating from '../components/StarRating';
import LoadingScreen from '../components/LoadingScreen';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById, rateArticle, loading } = useArticles();
  const [article, setArticle] = useState<any>(null);
  const [rated, setRated] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundArticle = getArticleById(id);
      if (foundArticle) {
        setArticle(foundArticle);
      }
    }
  }, [id, getArticleById]);

  const handleRating = async (rating: number) => {
    if (!id || rated) return;
    
    setRatingLoading(true);
    const success = await rateArticle(id, rating);
    
    if (success) {
      setRated(true);
    }
    setRatingLoading(false);
  };

  if (loading || !article) {
    return <LoadingScreen />;
  }

  // Sample article content if not provided
  const articleContent = article.content || `
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nisi quis tincidunt ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nunc. Fusce euismod, nisi quis tincidunt ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nunc.</p>
    <p>Sed euismod, nisi quis tincidunt ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nunc. Fusce euismod, nisi quis tincidunt ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nunc.</p>
    <h2>Key Insights</h2>
    <p>Fusce euismod, nisi quis tincidunt ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nunc. Sed euismod, nisi quis tincidunt ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nunc.</p>
    <ul>
      <li>Item one with important information</li>
      <li>Item two with critical details</li>
      <li>Item three that explains the concept</li>
    </ul>
    <p>Nunc euismod, nisi quis tincidunt ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nunc. Fusce euismod, nisi quis tincidunt ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl quis nunc.</p>
  `;

  const defaultImage = 'https://images.pexels.com/photos/3944425/pexels-photo-3944425.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <div className="animate-fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-primary-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to articles
      </button>
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
            {article.category}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-neutral-500 gap-x-6 gap-y-2">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>John Doe</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>June 3, 2025</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>5 min read</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="w-4 h-4 mr-2" />
              <span>132 likes</span>
            </div>
          </div>
        </div>
        
        <div className="mb-8 overflow-hidden rounded-xl">
          <img 
            src={article.imageUrl || defaultImage} 
            alt={article.title} 
            className="w-full h-80 object-cover"
          />
        </div>
        
        <div className="prose max-w-none mb-10">
          <div dangerouslySetInnerHTML={{ __html: articleContent }} />
        </div>
        
        <div className="border-t border-neutral-200 pt-6">
          <div className="bg-neutral-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">How would you rate this article?</h3>
            
            {rated ? (
              <div className="flex items-center text-green-600">
                <ThumbsUp className="w-5 h-5 mr-2" />
                <span>Thank you for your rating!</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <StarRating onRatingChange={handleRating} />
                
                {ratingLoading && (
                  <span className="text-sm text-neutral-500 animate-pulse">
                    Saving rating...
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;