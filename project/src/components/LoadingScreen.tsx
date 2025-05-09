import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-primary-400 animate-spin" />
        <p className="mt-4 text-neutral-600 animate-pulse">Loading ArticleSync...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;