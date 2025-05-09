import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserPreferences } from '../contexts/AuthContext';

const categories = ['Technology', 'Business', 'Health', 'Science', 'Entertainment', 'Sports', 'Politics'];
const tones = ['Informative', 'Analytical', 'Fun', 'Emotional', 'Controversial', 'Inspirational'];
const lengths = ['Short', 'Medium', 'Long'];

const Preferences: React.FC = () => {
  const { user, preferences, updateUserPreferences } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserPreferences & { username?: string; userType?: string }>({
    preferred_category: 'Technology',
    preferred_tone: 'Informative',
    preferred_length: 'Medium',
    wants_trending: true,
    username: '',
    userType: ''
  });

  useEffect(() => {
    if (preferences) {
      setFormData(prev => ({
        ...prev,
        preferred_category: preferences.preferred_category || 'Technology',
        preferred_tone: preferences.preferred_tone || 'Informative',
        preferred_length: preferences.preferred_length || 'Medium',
        wants_trending: preferences.wants_trending !== undefined ? preferences.wants_trending : true,
        username: (preferences as any).username || '',
        userType: (preferences as any).userType || ''
      }));
    }
  }, [preferences]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Preferences form submit started');
    setLoading(true);
    setSuccess(false);
    setError(null);

      try {
        console.log('Calling updateUserPreferences with:', formData);
        await updateUserPreferences(formData);
        console.log('updateUserPreferences succeeded');
        setSuccess(true);
        
        // Redirect to recommendations page (Home) after saving preferences immediately
        navigate('/');
      } catch (err: any) {
        console.error('updateUserPreferences failed:', err);
        setError(err.message || 'Failed to update preferences');
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-900 mb-3">
          {preferences ? 'Update Your Preferences' : 'Welcome! Set Your Preferences'}
        </h1>
        <p className="text-neutral-600">
          Tell us about your reading preferences to help us personalize your article recommendations.
        </p>
      </div>
      
      <div className="card">
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-start">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Your preferences have been saved successfully!</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username || ''}
              onChange={handleChange}
              className="input"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-neutral-700 mb-1">
              User Type
            </label>
            <input
              id="userType"
              name="userType"
              type="text"
              value={formData.userType || ''}
              onChange={handleChange}
              className="input"
              placeholder="Enter your user type (optional)"
            />
          </div>

          <div>
            <label htmlFor="preferred_category" className="block text-sm font-medium text-neutral-700 mb-1">
              Preferred Category
            </label>
            <select
              id="preferred_category"
              name="preferred_category"
              required
              value={formData.preferred_category}
              onChange={handleChange}
              className="input"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="preferred_tone" className="block text-sm font-medium text-neutral-700 mb-1">
              Preferred Tone
            </label>
            <select
              id="preferred_tone"
              name="preferred_tone"
              required
              value={formData.preferred_tone}
              onChange={handleChange}
              className="input"
            >
              {tones.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="preferred_length" className="block text-sm font-medium text-neutral-700 mb-1">
              Preferred Length
            </label>
            <select
              id="preferred_length"
              name="preferred_length"
              required
              value={formData.preferred_length}
              onChange={handleChange}
              className="input"
            >
              {lengths.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="wants_trending"
              name="wants_trending"
              type="checkbox"
              checked={formData.wants_trending}
              onChange={handleChange}
              className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-400"
            />
            <label htmlFor="wants_trending" className="ml-2 block text-sm text-neutral-700">
              Include trending topics in my recommendations
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-5 h-5 mr-2" />
                Save Preferences
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Preferences