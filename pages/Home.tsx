
import React, { useState, useEffect, useCallback } from 'react';
import { Product, Category, SortOption } from '../types';
import api from '../api';
import { ProductCard, Skeleton, EmptyState } from '../components/UI';

const LIMIT = 12;

const Home: React.FC<{ searchQuery: string }> = ({ searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState<SortOption>('none');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.slice(0, 8)));
  }, []);

  const fetchProducts = useCallback(async (currentOffset: number, clear: boolean = false) => {
    if (clear) setLoading(true);
    else setLoadingMore(true);

    try {
      const params: any = {
        offset: currentOffset,
        limit: LIMIT,
      };

      if (selectedCat) params.categoryId = selectedCat;
      if (searchQuery) params.title = searchQuery;
      if (priceRange.min > 0) params.price_min = priceRange.min;
      if (priceRange.max < 1000) params.price_max = priceRange.max;

      const res = await api.get('/products', { params });
      const data = res.data;
      
      if (!Array.isArray(data) || data.length < LIMIT) setHasMore(false);
      else setHasMore(true);

      setProducts(prev => clear ? data : [...prev, ...data]);
    } catch (err) {
      console.error("Fetch Error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCat, searchQuery, priceRange]);

  useEffect(() => {
    setOffset(0);
    fetchProducts(0, true);
  }, [selectedCat, searchQuery, priceRange, fetchProducts]);

  const loadMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchProducts(nextOffset);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-700">
      {/* Dynamic Hero Section */}
      {!searchQuery && offset === 0 && !selectedCat && (
        <div className="relative h-[500px] rounded-[60px] overflow-hidden mb-20 bg-black flex items-center px-8 md:px-24">
          <img 
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale mix-blend-overlay"
            alt="Hero"
          />
          <div className="relative z-10 max-w-2xl">
            <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.5em] block mb-6">Autonomous Series v.25</span>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] mb-10 italic">SYSTEM<br/>UTILITY.</h1>
            <p className="text-white/50 text-base font-medium max-w-sm mb-12 leading-relaxed">
              Industrial grade performance for the modern architecture of survival. Engineered to endure.
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-black px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95 shadow-2xl">
                Deploy Gear
              </button>
              <button className="border border-white/20 text-white px-12 py-5 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                The Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-20">
        <aside className="w-full lg:w-72 space-y-16">
          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 flex items-center gap-4">
              <span className="w-4 h-[1px] bg-gray-200"></span> COLLECTIONS
            </h4>
            <div className="flex flex-wrap lg:flex-col gap-2">
              <button 
                onClick={() => setSelectedCat(null)}
                className={`text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${!selectedCat ? 'bg-black text-white shadow-2xl scale-[1.05]' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
              >
                All Systems
              </button>
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${selectedCat === cat.id ? 'bg-black text-white shadow-2xl scale-[1.05]' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-10 flex items-center gap-4">
              <span className="w-4 h-[1px] bg-gray-200"></span> PARAMETERS
            </h4>
            <div className="space-y-8">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 block">MIN VAL</label>
                     <input 
                        type="number" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-xs font-bold focus:ring-1 focus:ring-black"
                     />
                  </div>
                  <div>
                     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 block">MAX VAL</label>
                     <input 
                        type="number" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                        className="w-full bg-gray-50 border-none rounded-xl py-4 px-6 text-xs font-bold focus:ring-1 focus:ring-black"
                     />
                  </div>
               </div>
               <input 
                type="range" 
                min="0" 
                max="1000" 
                step="50"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="w-full h-[2px] bg-gray-100 appearance-none cursor-pointer accent-black"
              />
            </div>
          </section>
        </aside>

        <div className="flex-1">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic">
                {searchQuery ? `SEARCH: ${searchQuery}` : selectedCat ? categories.find(c => c.id === selectedCat)?.name : 'INVENTORY'}
              </h2>
              <div className="flex items-center gap-4 mt-4">
                 <span className="w-8 h-1 bg-black"></span>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Curated Assets: {products.length}</p>
              </div>
            </div>
          </div>

          {loading && offset === 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : sortedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                {sortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {hasMore && (
                <div className="mt-24 flex justify-center">
                  <button 
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="group px-20 py-6 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-[0.4em] hover:bg-gray-800 transition-all flex items-center gap-8 shadow-2xl"
                  >
                    {loadingMore ? 'SYNCING DATA...' : 'NEXT INVENTORY'}
                    <span className="group-hover:translate-x-3 transition-transform">→</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState 
              title="ZERO ASSETS FOUND" 
              sub="The current parameters yielded no matching results. Broaden your search criteria." 
              actionText="RESET PROTOCOL" 
              actionLink="#/" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
