import React from 'react';
import { BookOpen, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen className="w-6 h-6 text-primary-400" />
            <span className="text-lg font-semibold">ArticleSync</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              {/* Removed About, Privacy, Terms links */}
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-white"
              >
                <Github className="w-5 h-5" />
              </a>
              {/* Removed Made with and in 2025 text */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
