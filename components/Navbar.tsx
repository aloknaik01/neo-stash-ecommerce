
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { logout } from '../store';
import { ICONS } from '../constants';

const Navbar: React.FC<{ onSearch: (val: string) => void }> = ({ onSearch }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items, wishlist } = useAppSelector(state => state.cart);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-[100] bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 md:px-12 py-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        <Link to="/" className="text-2xl font-black tracking-tighter text-black flex-shrink-0 italic">
          NEO.STASH
        </Link>

        <div className="flex-1 max-w-2xl relative hidden sm:block">
          <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search Ecosystem..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:ring-1 focus:ring-black transition-all"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-8">
          <Link to="/wishlist" className="relative p-2 group transition-all">
            <ICONS.Heart className="w-5 h-5 text-gray-800 group-hover:scale-110" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black animate-pulse">
                {wishlist.length}
              </span>
            )}
          </Link>
          
          <Link to="/cart" className="relative p-2 group transition-all">
            <ICONS.Cart className="w-5 h-5 text-gray-800 group-hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </Link>
          
          <div className="relative group/user">
            <button className="flex items-center gap-3 p-1.5 pl-1.5 pr-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all duration-300 group">
              {user ? (
                <img src={user.avatar} className="w-8 h-8 rounded-xl object-cover" alt="Profile" />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center">
                  <ICONS.User className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">
                {user ? user.name.split(' ')[0] : 'ENTRY'}
              </span>
            </button>
            
            <div className="absolute right-0 top-full pt-4 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 translate-y-2 group-hover/user:translate-y-0">
              <div className="bg-white border border-gray-100 shadow-[0_32px_64px_rgba(0,0,0,0.1)] rounded-[32px] py-4 w-56 overflow-hidden">
                {user ? (
                  <>
                    <Link to="/profile" className="block px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">Identity Hub</Link>
                    <Link to="/orders" className="block px-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black hover:bg-gray-50 transition-colors">Order History</Link>
                    <div className="h-[1px] bg-gray-50 mx-6 my-2"></div>
                    <button 
                      onClick={() => { dispatch(logout()); navigate('/login'); }} 
                      className="w-full text-left px-8 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50">Sign In</Link>
                    <Link to="/signup" className="block px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-700 hover:bg-gray-50">Initialize</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
