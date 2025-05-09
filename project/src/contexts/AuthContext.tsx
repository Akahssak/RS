import React, { createContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { auth, googleProvider } from '../firebase/config';

export interface UserPreferences {
  preferred_category: string;
  preferred_tone: string;
  preferred_length: string;
  wants_trending: boolean;
}

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  preferences: UserPreferences | null;
  isNewUser: boolean;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  updateUserPreferences: (preferences: UserPreferences & { username?: string; userType?: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  preferences: null,
  isNewUser: false,
  loginWithGoogle: async () => {
    throw new Error('AuthContext not initialized');
  },
  logout: async () => {
    throw new Error('AuthContext not initialized');
  },
  updateUserPreferences: async () => {
    throw new Error('AuthContext not initialized');
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('onAuthStateChanged triggered with user:', user);
      setUser(user);
      setIsNewUser(false);

      if (user) {
        try {
          console.log('Fetching user preferences for user:', user.uid);
          // Check if user exists in backend
          const response = await axios.get(`/api/users/${user.uid}`);
          if (response.status === 200) {
            const userData = response.data;
            console.log('User data received:', userData);
            setPreferences(userData.preferences || null);
            // Check if email and username exist, if not mark as new user
            if (!userData.username || !userData.email) {
              console.log('User missing username or email, marking as new user');
              setPreferences(null); // Force preferences page to show
              setIsNewUser(true);
            }
          }
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            console.log('User not found, creating new user with default preferences');
            // User not found, create new user with default preferences and username as email
            const defaultPreferences: UserPreferences = {
              preferred_category: 'Technology',
              preferred_tone: 'Informative',
              preferred_length: 'Medium',
              wants_trending: true
            };
            try {
              await axios.post('/api/users', {
                userId: user.uid,
                email: user.email,
                username: user.email,
                preferences: defaultPreferences
              });
              setPreferences(null); // Force preferences page to show
              setIsNewUser(true);
            } catch (err: any) {
              console.error('Error creating new user:', err);
              setPreferences(null);
              setIsNewUser(true);
            }
          } else {
            console.error('Error fetching user preferences:', error);
            setPreferences(null);
          }
        }
      } else {
        setPreferences(null);
      }

      // Delay setting loading false to ensure state updates propagate
      setTimeout(() => {
        setLoading(false);
      }, 100);

    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
    setPreferences(null);
  };

  const updateUserPreferences = async (newPreferences: UserPreferences & { username?: string; userType?: string }): Promise<void> => {
    if (!user) throw new Error('User must be logged in');

    try {
      const { username, userType, ...preferences } = newPreferences;
      await axios.post('/api/users', {
        userId: user.uid,
        email: user.email,
        preferences,
        username,
        userType
      });
      setPreferences(preferences);
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  };

  const value: AuthContextProps = {
    user,
    loading,
    preferences,
    isNewUser,
    loginWithGoogle,
    logout,
    updateUserPreferences,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
