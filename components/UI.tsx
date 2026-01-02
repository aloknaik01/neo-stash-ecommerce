import React from 'react';
import { Product } from '../types';
import { ICONS, CLEAN_IMG_URL } from '../constants';
import { useAppSelector, useCartActions, useToast } from '../hooks';

export const Toast: React.FC = () => {
  const { toast } = useToast();
  if (!toast.type) return null;
  
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl z-[100] flex items-center gap-3 transition-all animate-bounce ${
      toast.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'
    }`}>
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { toggleFav, isInWishlist, addItem } = useCartActions();
  const { showToast } = useToast();
  const discountedPrice = Math.floor(product.price * 1.2); 
  const isFav = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    showToast('Item deployed to cart.', 'success');
  };

  const handleToggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFav(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <button 
        onClick={handleToggleFav}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all"
      >
        <ICONS.Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 stroke-red-500' : 'text-gray-400'}`} />
      </button>

      <a href={`#/product/${product.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-gray-50">
          <img 
            src={CLEAN_IMG_URL(product.images[0])} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            alt={product.title}
          />
        </div>
        
        <div className="p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            {product.category.name}
          </p>
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-black transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold">${product.price}</span>
            <span className="text-xs text-gray-400 line-through">${discountedPrice}</span>
            <span className="text-xs text-green-600 font-bold">20% OFF</span>
          </div>
          
          <div className="flex items-center gap-1 mt-2">
             <ICONS.Star className="w-3 h-3 text-amber-400" />
             <span className="text-xs text-gray-500 font-medium">4.5 (120 reviews)</span>
          </div>
        </div>
      </a>

      <div className="px-4 pb-4">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-black text-white py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <ICONS.Cart className="w-3.5 h-3.5" />
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export const Skeleton: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="aspect-[4/5] bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-1/4 bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-6 w-1/2 bg-gray-200 rounded" />
    </div>
  </div>
);

export const EmptyState: React.FC<{ title: string; sub: string; actionText?: string; actionLink?: string }> = ({ title, sub, actionText, actionLink }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
      <ICONS.Search className="w-10 h-10 text-gray-300" />
    </div>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-gray-500 mb-8 max-w-xs">{sub}</p>
    {actionText && (
      <a href={actionLink} className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
        {actionText}
      </a>
    )}
  </div>
);