import React, { useState, useEffect } from 'react';
import { useAppDispatch, useToast } from '../hooks';
import { setAuth } from '../store';
import api from '../api';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const loginRes = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token } = loginRes.data;
      
      const profileRes = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      
      dispatch(setAuth({
        user: profileRes.data,
        token: access_token,
        refreshToken: refresh_token
      }));
      
      showToast('Access granted.', 'success');
      window.location.hash = '#/';
    } catch (err) {
      showToast('Authentication failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
        <h1 className="text-4xl font-bold mb-2 tracking-tighter">Welcome Back.</h1>
        <p className="text-gray-400 mb-10 font-medium">Entry credentials required.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-black" />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-50">
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const Signup: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/users', {
        name,
        email,
        password,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      });
      showToast('Account initialized.', 'success');
      window.location.hash = '#/login';
    } catch (err) {
      showToast('Creation failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-[40px] shadow-sm border border-gray-100">
        <h1 className="text-4xl font-bold mb-2 tracking-tighter">New Account.</h1>
        <p className="text-gray-400 mb-10 font-medium">Join our minimalist ecosystem.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input required placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm" />
          <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm" />
          <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm" />
          <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-4 rounded-2xl font-bold">
            {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
};