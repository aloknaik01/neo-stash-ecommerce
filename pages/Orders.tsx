
import React from 'react';
// Fix: Replacing useApp from AppContext with useAppSelector from Redux hooks
import { useAppSelector } from '../hooks';
import { EmptyState } from '../components/UI';
import { CLEAN_IMG_URL } from '../constants';

const Orders: React.FC = () => {
  // Fix: Selecting orders from the Redux store's cart slice instead of legacy AppContext
  const { orders } = useAppSelector(state => state.cart);

  if (orders.length === 0) return (
    <EmptyState 
      title="No Orders Yet" 
      sub="You haven't placed any orders yet. Explore our latest collections and find something you love!" 
      actionText="Start Shopping" 
      actionLink="#/" 
    />
  );

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-4xl font-bold mb-12">Your Orders</h1>
      
      <div className="space-y-8">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <div className="bg-gray-50 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                  <p className="font-bold text-sm">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="font-bold text-sm">${order.total}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {order.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 text-left md:text-right">Order ID</p>
                <p className="font-mono text-sm font-bold">#{order.id.split('-')[1]}</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-6 items-center">
                   <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={CLEAN_IMG_URL(item.images[0])} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                      <p className="text-sm text-gray-400 font-medium">Quantity: {item.quantity}</p>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-lg">${item.price}</p>
                      <button className="text-[10px] font-bold text-black border-b border-black uppercase tracking-wider hover:opacity-70 transition-opacity">Buy Again</button>
                   </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-50 flex justify-end gap-4">
               <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-xs hover:bg-white transition-all">Download Invoice</button>
               <button className="px-6 py-3 bg-black text-white rounded-xl font-bold text-xs hover:bg-gray-800 transition-all">Track Shipment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
