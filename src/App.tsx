import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import DashboardPage from './pages/DashboardPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackOrderPage from './pages/TrackOrderPage';
import { Product, CartItem } from './types';
import { productService } from './services/productService';
import { orderService } from './services/orderService';

function AppContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initial sync with Firebase Firestore
    productService.syncWithFirestore();
    orderService.syncWithFirestore();
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const handleSetSelectedCategory = (category: string) => {
    if (category === 'الكل') {
      navigate('/');
    } else {
      navigate(`/category/${category}`);
    }
  };

  const isDashboard = location.pathname === '/dashboard';

  const content = (
    <Routes>
      <Route 
        path="/" 
        element={
          <HomePage 
            addToCart={addToCart} 
            setSelectedCategory={handleSetSelectedCategory} 
          />
        } 
      />
      <Route 
        path="/category/:categoryName" 
        element={<CategoryPage addToCart={addToCart} />} 
      />
      <Route 
        path="/product/:productId" 
        element={<ProductPage addToCart={addToCart} />} 
      />
      <Route 
        path="/dashboard" 
        element={<DashboardPage />} 
      />
      <Route 
        path="/checkout" 
        element={<CheckoutPage cart={cart} setCart={setCart} />} 
      />
      <Route 
        path="/track-order" 
        element={<TrackOrderPage />} 
      />
    </Routes>
  );

  if (isDashboard) {
    return content;
  }

  return (
    <Layout 
      cart={cart} 
      setCart={setCart} 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery}
    >
      {content}
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
