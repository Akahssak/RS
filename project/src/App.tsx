import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Preferences from './pages/Preferences';
import ArticleDetail from './pages/ArticleDetail';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const { user, loading, isNewUser } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user && isNewUser) {
    return <Navigate to="/preferences" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<Home />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
