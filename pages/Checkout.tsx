import React, { useState } from 'react';
import { useAppDispatch, useAppSelector, useToast } from '../hooks';
import { placeOrder as placeOrderAction } from '../store';
import { ICONS, CLEAN_IMG_URL } from '../constants';
import { Order } from '../types';

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { items: cart, addresses } = useAppSelector(state => state.cart);
  const { showToast } = useToast();
  
  const [selectedAddr, setSelectedAddr] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '');
  const [step, setStep] = useState<'address' | 'summary' | 'success'>('address');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  if (cart.length === 0 && step !== 'success') {
    window.location.hash = '#/';
    return null;
  }

  const handlePlaceOrder = () => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total,
      status: 'Processing',
      addressId: selectedAddr
    };
    dispatch(placeOrderAction(newOrder));
    setStep('success');
    showToast('Deployment confirmed.', 'success');
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-24 px-8 text-center">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-12 text-lg">Your purchase is in transit. Connection established with {user?.email}.</p>
        <div className="flex gap-4 justify-center">
           <a href="#/orders" className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all">Track Order</a>
           <a href="#/" className="bg-gray-100 text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all">Continue Shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-bold mb-12">Finalize Your Order</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12">
          <section className={`${step !== 'address' ? 'opacity-50 pointer-events-none' : ''}`}>
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
               <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</span>
               Delivery Address
             </h2>
             
             {addresses.length === 0 ? (
               <div className="p-8 border-2 border-dashed rounded-3xl text-center">
                 <p className="text-gray-400 mb-6 font-medium">No location protocols found.</p>
                 <a href="#/profile" className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm">Manage Hubs</a>
               </div>
             ) : (
               <div className="grid gap-4">
                 {addresses.map(addr => (
                   <label key={addr.id} className={`flex items-start gap-4 p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                     selectedAddr === addr.id ? 'border-black bg-white shadow-xl' : 'border-gray-100 bg-gray-50'
                   }`}>
                     <input 
                       type="radio" 
                       name="address" 
                       checked={selectedAddr === addr.id}
                       onChange={() => setSelectedAddr(addr.id)}
                       className="mt-1 w-5 h-5 text-black focus:ring-black border-gray-300"
                     />
                     <div>
                       <div className="flex items-center gap-3 mb-1">
                         <span className="font-bold text-lg">{addr.name}</span>
                         {addr.isDefault && <span className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 px-2 py-1 rounded">Primary</span>}
                       </div>
                       <p className="text-gray-500 text-sm leading-relaxed">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                     </div>
                   </label>
                 ))}
               </div>
             )}
             
             {step === 'address' && (
               <button onClick={() => setStep('summary')} disabled={!selectedAddr} className="mt-8 bg-black text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 disabled:opacity-50 transition-all">
                 NEXT: VIEW SUMMARY
               </button>
             )}
          </section>

          <section className={`${step !== 'summary' ? 'opacity-50 pointer-events-none' : ''}`}>
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-4">
               <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">2</span>
               Order Summary
             </h2>
             <div className="bg-white rounded-3xl border border-gray-100 p-8 space-y-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={CLEAN_IMG_URL(item.images[0])} className="w-16 h-16 rounded-xl object-cover bg-gray-50" alt="" />
                    <div className="flex-1">
                       <h4 className="font-bold text-sm line-clamp-1">{item.title}</h4>
                       <p className="text-xs text-gray-400 font-medium">Qty: {item.quantity} x ${item.price}</p>
                    </div>
                    <div className="font-bold">${item.price * item.quantity}</div>
                  </div>
                ))}
             </div>
             
             {step === 'summary' && (
               <div className="flex gap-4 mt-8">
                 <button onClick={() => setStep('address')} className="px-8 py-4 border-2 border-black rounded-2xl font-bold hover:bg-gray-50 transition-all">BACK</button>
                 <button onClick={handlePlaceOrder} className="flex-1 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10">
                    CONFIRM & PLACE ORDER • ${total}
                 </button>
               </div>
             )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;