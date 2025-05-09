import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  initialRating?: number;
  onRatingChange: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  initialRating = 0, 
  onRatingChange,
  readOnly = false 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (selectedRating: number) => {
    if (readOnly) return;
    
    setRating(selectedRating);
    onRatingChange(selectedRating);
  };
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          className={`rating-star transition-all duration-300 ${
            (hoverRating || rating) >= star
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-neutral-300'
          } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
        />
      ))}
    </div>
  );
};

export default StarRating;