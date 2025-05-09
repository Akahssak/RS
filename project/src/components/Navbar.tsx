import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-primary-400" />
            <span className="text-xl font-bold text-primary-900">ArticleSync</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/" className="text-neutral-700 hover:text-primary-500 transition">
                  Home
                </Link>
                <Link to="/preferences" className="text-neutral-700 hover:text-primary-500 transition">
                  Preferences
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-neutral-700">
                    {user.email?.split('@')[0]}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="btn-secondary flex items-center space-x-1 py-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-neutral-700 hover:text-primary-500 transition">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-neutral-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link 
                    to="/" 
                    className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-neutral-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="w-5 h-5 text-primary-400" />
                    <span>Home</span>
                  </Link>
                  <Link 
                    to="/preferences" 
                    className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-neutral-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 text-primary-400" />
                    <span>Preferences</span>
                  </Link>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-neutral-100">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-neutral-500" />
                      <span className="text-neutral-700">{user.email?.split('@')[0]}</span>
                    </div>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-accent-400 flex items-center space-x-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="py-2 px-3 rounded-lg hover:bg-neutral-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="py-2 px-3 bg-primary-400 text-white rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;