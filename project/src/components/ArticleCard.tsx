import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../hooks/useArticles';
import { ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  isRecommended?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isRecommended = false }) => {
  const defaultImage = 'https://images.pexels.com/photos/3944425/pexels-photo-3944425.jpeg?auto=compress&cs=tinysrgb&w=800';
  
  return (
    <div className={`article-card group ${isRecommended ? 'border-l-4 border-accent-400' : ''}`}>
      {isRecommended && (
        <div className="absolute -top-3 -right-3 bg-accent-400 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12 shadow-md">
          Recommended
        </div>
      )}
      
      <div className="h-40 overflow-hidden rounded-t-lg -mx-6 -mt-6 mb-4">
        <img 
          src={article.imageUrl || defaultImage} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      
      <div className="mb-2">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary-100 text-primary-700">
          {article.category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary-500 transition-colors">
        {article.title}
      </h3>
      
      <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
        {article.summary}
      </p>
      
      {/* Removed "Read more" link as per user request */}
      {/* <Link 
        to={`/article/${article.id}`} 
        className="inline-flex items-center font-medium text-primary-500 hover:text-primary-600 transition-colors"
      >
        Read more <ChevronRight className="w-4 h-4 ml-1" />
      </Link> */}
    </div>
  );
};

export default ArticleCard;