import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { API_BASE, CLEAN_IMG_URL, ICONS } from '../constants';
import { useCartActions, useToast } from '../hooks';
import { ProductCard, Skeleton } from '../components/UI';
import api from '../api';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, toggleFav, isInWishlist } = useCartActions();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    
    const fetchProductData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setActiveImg(0);
        
        const relRes = await api.get(`/products/${id}/related`);
        setRelated(relRes.data.slice(0, 4));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row gap-12">
      <div className="w-full lg:w-1/2 aspect-[4/5] bg-gray-100 rounded-[40px] animate-pulse" />
      <div className="flex-1 space-y-6">
        <div className="h-8 bg-gray-100 rounded w-1/4" />
        <div className="h-20 bg-gray-100 rounded w-full" />
        <div className="h-40 bg-gray-100 rounded w-full" />
      </div>
    </div>
  );

  if (!product) return <div className="py-20 text-center font-bold">Product not found</div>;

  const isFav = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    showToast(`${quantity} units added to cart.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Gallery */}
        <div className="w-full lg:w-3/5">
          <div className="sticky top-28">
            <div className="aspect-[4/5] rounded-[40px] overflow-hidden bg-gray-100 mb-6 group relative">
              <img 
                src={CLEAN_IMG_URL(product.images[activeImg])} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                alt={product.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    activeImg === idx ? 'border-black scale-105 shadow-xl' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={CLEAN_IMG_URL(img)} className="w-full h-full object-cover" alt="thumb" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col py-4">
          <div className="mb-10">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4">{product.category.name}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[0.9] mb-8">{product.title}</h1>
            
            <div className="flex items-center gap-6 mb-8">
              <span className="text-4xl font-bold tracking-tighter">${product.price}</span>
              <div className="h-8 w-[1px] bg-gray-200" />
              <div className="flex items-center gap-2">
                 <ICONS.Star className="w-4 h-4 text-amber-400" />
                 <span className="text-sm font-bold">4.9 / 5.0</span>
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed text-lg max-w-md">
              {product.description}
            </p>
          </div>

          <div className="space-y-6 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-4 hover:text-black transition-colors">
                  <ICONS.Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="p-4 hover:text-black transition-colors">
                  <ICONS.Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <button 
                onClick={() => toggleFav(product)}
                className={`p-5 border border-gray-100 rounded-2xl transition-all ${isFav ? 'bg-red-50 border-red-100' : 'hover:bg-gray-50'}`}
              >
                <ICONS.Heart className={`w-6 h-6 ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-900 transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4"
            >
              Add To Shopping Bag
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 pt-12 border-t border-gray-100">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-xs">01</div>
                <div>
                   <h4 className="font-bold text-sm mb-1">Authentic Materials</h4>
                   <p className="text-xs text-gray-400 font-medium">Sourced from certified ethical providers globally.</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-xs">02</div>
                <div>
                   <h4 className="font-bold text-sm mb-1">Carbon Neutral</h4>
                   <p className="text-xs text-gray-400 font-medium">Every purchase plants a tree in our reforestation project.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold tracking-tighter">Recommended For You</h2>
            <div className="flex gap-2">
               <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-50">←</div>
               <div className="w-10 h-10 rounded-full border border-black flex items-center justify-center cursor-pointer bg-black text-white shadow-lg">→</div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;