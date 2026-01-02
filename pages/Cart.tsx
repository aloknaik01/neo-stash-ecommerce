import React from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { removeFromCart, updateQuantity } from '../store';
import { ICONS, CLEAN_IMG_URL } from '../constants';
import { EmptyState } from '../components/UI';

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: cart } = useAppSelector(state => state.cart);
  
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  if (cart.length === 0) return (
    <EmptyState 
      title="Your Bag is Empty" 
      sub="Looks like you haven't added anything to your cart yet. Let's start shopping!" 
      actionText="Start Shopping" 
      actionLink="#/" 
    />
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-bold mb-12">Shopping Bag ({cart.length})</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-6">
          {cart.map(item => (
            <div key={item.id} className="flex gap-6 p-6 bg-white rounded-3xl border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={CLEAN_IMG_URL(item.images[0])} className="w-full h-full object-cover" alt={item.title} />
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.category.name}</p>
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-black">{item.title}</h3>
                  </div>
                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  >
                    <ICONS.Trash className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-auto">
                   <div className="text-2xl font-bold">${item.price}</div>
                   <div className="text-sm text-gray-400 line-through">${Math.floor(item.price * 1.2)}</div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gray-100 rounded-xl px-2">
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, delta: -1 }))} className="p-2 hover:text-black">
                      <ICONS.Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id, delta: 1 }))} className="p-2 hover:text-black">
                      <ICONS.Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="font-bold text-gray-400">Subtotal: ${item.price * item.quantity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-[400px] h-fit sticky top-28">
          <div className="bg-black text-white p-8 rounded-[32px] shadow-2xl">
            <h2 className="text-xl font-bold mb-8 flex items-center justify-between">
              Order Summary
              <ICONS.Cart className="w-5 h-5 opacity-50" />
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-white/60 text-sm font-medium">
                <span>Items Subtotal</span>
                <span className="text-white">${subtotal}</span>
              </div>
              <div className="flex justify-between text-white/60 text-sm font-medium">
                <span>Shipping Fee</span>
                <span className="text-white">{delivery === 0 ? 'FREE' : `$${delivery}`}</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-white/60 text-sm font-bold uppercase tracking-widest">Total Pay</span>
                <span className="text-4xl font-bold">${total}</span>
              </div>
            </div>

            <a href="#/checkout" className="w-full bg-white text-black py-5 rounded-2xl font-bold text-center block hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
              CHECKOUT NOW
              <ICONS.ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;