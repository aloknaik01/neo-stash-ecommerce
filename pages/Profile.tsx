import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector, useAuth, useToast } from '../hooks';
import { updateUserInState, addAddress, removeAddress, setDefaultAddressAction, logout as logoutAction } from '../store';
import { ICONS, API_BASE, CLEAN_IMG_URL } from '../constants';
import { Product, Category, Address } from '../types';
import api from '../api';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { addresses } = useAppSelector(state => state.cart);
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'merchant' | 'settings'>('profile');
  const [merchantSubTab, setMerchantSubTab] = useState<'products' | 'categories'>('products');
  
  const [showModal, setShowModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const [editUserForm, setEditUserForm] = useState({ name: user?.name || '', avatar: user?.avatar || '' });
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  
  const [newAddr, setNewAddr] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false });
  const [productForm, setProductForm] = useState({ title: '', price: 0, description: '', categoryId: 1, images: ['https://picsum.photos/600/600'] });
  const [categoryForm, setCategoryForm] = useState({ name: '', image: 'https://picsum.photos/600/400' });

  const refreshData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/products?limit=10&offset=0'),
        api.get('/categories')
      ]);
      setMyProducts(pRes.data);
      setCategories(cRes.data);
    } catch (e) {
      showToast('Sync failed', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'merchant') refreshData();
  }, [activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'product' | 'category') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const location = res.data.location;
      
      if (type === 'avatar') setEditUserForm({ ...editUserForm, avatar: location });
      else if (type === 'product') setProductForm({ ...productForm, images: [location] });
      else if (type === 'category') setCategoryForm({ ...categoryForm, image: location });
      
      showToast('Asset synchronized.', 'success');
    } catch (err) {
      showToast('Upload failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await api.put(`/users/${user.id}`, editUserForm);
      dispatch(updateUserInState(res.data));
      showToast('Identity updated.', 'success');
      setActiveTab('profile');
    } catch (err) {
      showToast('Update failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const address: Address = { ...newAddr, id: Date.now().toString() };
    dispatch(addAddress(address));
    setShowModal(false);
    showToast('Location verified.', 'success');
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-16">
        <aside className="w-full lg:w-80">
          <div className="bg-white p-12 rounded-[50px] border border-gray-100 text-center mb-8 shadow-sm sticky top-28">
             <div className="relative inline-block mb-8 group">
                <img src={CLEAN_IMG_URL(user.avatar)} className="w-36 h-36 rounded-full border-4 border-white shadow-2xl object-cover" alt="Avatar" />
                <button onClick={() => setActiveTab('settings')} className="absolute -bottom-1 -right-1 p-3 bg-black text-white rounded-full border-4 border-white hover:scale-110 transition-transform">
                  <ICONS.Star className="w-4 h-4 fill-white" />
                </button>
             </div>
             <h2 className="text-3xl font-bold mb-1 tracking-tighter">{user.name}</h2>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 mb-10">{user.role}</p>
             <div className="space-y-2">
               <button onClick={() => setActiveTab('profile')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}>Addresses</button>
               <button onClick={() => setActiveTab('merchant')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'merchant' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}>Merchant Mode</button>
               <button onClick={() => setActiveTab('settings')} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}>Account Settings</button>
               <div className="pt-6"><button onClick={() => dispatch(logoutAction())} className="w-full py-4 text-red-500 font-black text-[9px] uppercase tracking-[0.2em] border border-red-50 rounded-2xl hover:bg-red-50">Sign Out</button></div>
             </div>
          </div>
        </aside>

        <div className="flex-1">
           {activeTab === 'profile' && (
             <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-center mb-12">
                  <h1 className="text-5xl font-bold tracking-tighter">My Locations.</h1>
                  <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-black text-white rounded-full font-black text-[10px] uppercase shadow-xl tracking-widest">Add Address</button>
                </div>
                <div className="grid gap-6">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`p-10 rounded-[40px] border-2 transition-all ${addr.isDefault ? 'border-black bg-white shadow-2xl scale-[1.01]' : 'border-gray-50 bg-gray-50/50'}`}>
                       <div className="flex justify-between items-start mb-4">
                          <span className="text-2xl font-bold tracking-tight">{addr.name} {addr.isDefault && <span className="ml-2 bg-black text-white text-[8px] px-3 py-1 rounded-full">Primary</span>}</span>
                          <div className="flex gap-2">
                            {!addr.isDefault && <button onClick={() => dispatch(setDefaultAddressAction(addr.id))} className="p-3 bg-white rounded-xl shadow-sm"><ICONS.Star className="w-5 h-5 text-amber-400" /></button>}
                            <button onClick={() => dispatch(removeAddress(addr.id))} className="p-3 bg-red-50 text-red-500 rounded-xl"><ICONS.Trash className="w-5 h-5" /></button>
                          </div>
                       </div>
                       <p className="text-gray-400 font-medium text-sm">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                  ))}
                </div>
             </div>
           )}

           {activeTab === 'settings' && (
             <div className="animate-in fade-in duration-500 max-w-2xl">
                <h1 className="text-5xl font-bold tracking-tighter mb-4">Identity Editor.</h1>
                <p className="text-gray-400 font-medium mb-12">Update your public profile.</p>
                <form onSubmit={handleUserUpdate} className="space-y-8">
                  <div className="flex items-center gap-8 mb-8">
                     <div className="relative group cursor-pointer">
                        <img src={CLEAN_IMG_URL(editUserForm.avatar)} className="w-24 h-24 rounded-3xl object-cover border-4 border-gray-50 group-hover:opacity-50 transition-all" alt="" />
                        <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                           <ICONS.Upload className="w-6 h-6 text-black" />
                           <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'avatar')} />
                        </label>
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">Avatar Essence</p>
                        <p className="text-xs text-gray-400">Upload a fresh persona image.</p>
                     </div>
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-300 mb-3 block">Display Name</label>
                    <input value={editUserForm.name} onChange={e => setEditUserForm({ ...editUserForm, name: e.target.value })} className="w-full bg-white border border-gray-100 rounded-[24px] py-5 px-8 font-bold text-lg focus:ring-1 focus:ring-black outline-none transition-all" />
                  </div>
                  <button type="submit" disabled={isLoading} className="px-12 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
                    {isLoading ? 'SYNCING...' : 'Save Changes'}
                  </button>
                </form>
             </div>
           )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowModal(false)} />
           <div className="relative bg-white w-full max-w-xl p-12 rounded-[50px] shadow-2xl">
              <h2 className="text-4xl font-bold mb-10 tracking-tighter">New Hub.</h2>
              <form onSubmit={handleAddAddress} className="space-y-4">
                 <input required placeholder="Name" value={newAddr.name} onChange={e => setNewAddr({...newAddr, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold" />
                 <input required placeholder="Phone" value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold" />
                 <input required placeholder="Street" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold" />
                 <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="City" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold" />
                    <input required placeholder="State" value={newAddr.state} onChange={e => setNewAddr({...newAddr, state: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-5 px-8 text-sm font-bold" />
                 </div>
                 <button type="submit" className="w-full py-6 bg-black text-white rounded-3xl font-black text-[10px] uppercase tracking-widest mt-6">Confirm Location</button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Profile;