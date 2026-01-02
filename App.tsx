import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, fetchProfile } from './store';
import { useAppDispatch } from './hooks';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import { Login, Signup } from './pages/Auth';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import { Toast } from './components/UI';
import { AuthGuard } from './components/AuthGuard';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB]">
      <Navbar onSearch={() => {}} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home searchQuery="" />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/orders" element={<AuthGuard><Orders /></AuthGuard>} />
          <Route path="/checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <footer className="bg-white border-t border-gray-100 py-20 px-4 md:px-8 mt-20">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 text-center md:text-left">
            <div className="space-y-8">
               <h2 className="text-3xl font-black tracking-tighter italic">NEO.STASH</h2>
               <p className="text-gray-400 text-sm font-medium leading-loose">
                  Industrial minimalism. High performance. Survival gear for the modern metropolis.
               </p>
            </div>
            <div>
               <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.3em] text-gray-300">Architecture</h4>
               <ul className="space-y-4 text-sm font-bold text-gray-500">
                  <li><a href="#" className="hover:text-black transition-colors">Utility Core</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Techwear</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-black mb-8 text-[10px] uppercase tracking-[0.3em] text-gray-300">Support</h4>
               <ul className="space-y-4 text-sm font-bold text-gray-500">
                  <li><a href="#" className="hover:text-black transition-colors">Shipment Tracking</a></li>
                  <li><a href="#" className="hover:text-black transition-colors">Help Desk</a></li>
               </ul>
            </div>
            <div className="bg-gray-50 p-10 rounded-[40px] border border-gray-100">
               <h4 className="font-black mb-4 text-[10px] uppercase tracking-[0.3em]">Protocol</h4>
               <p className="text-gray-400 text-xs mb-6 font-medium">Subscribe for deployment alerts.</p>
               <div className="flex bg-white rounded-2xl p-1 shadow-sm">
                  <input type="email" placeholder="Email" className="flex-1 bg-transparent border-none px-4 text-xs font-bold outline-none" />
                  <button className="bg-black text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">→</button>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">
            <p>© 2025 NEO-STASH ECOSYSTEM. DISTRIBUTED NATIONALLY.</p>
            <div className="flex gap-10">
               <span className="text-black">SECURE LAYER V.2</span>
               <span className="text-black">ENCRYPTED CONNECTION</span>
            </div>
         </div>
      </footer>
      <Toast />
    </div>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <Router>
      <AppContent />
    </Router>
  </Provider>
);

export default App;