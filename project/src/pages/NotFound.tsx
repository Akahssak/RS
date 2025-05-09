import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <h1 className="text-6xl font-bold text-primary-900 mb-4">404</h1>
      <p className="text-2xl text-neutral-600 mb-8">Oops! Page not found.</p>
      <p className="text-neutral-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn-primary flex items-center">
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;