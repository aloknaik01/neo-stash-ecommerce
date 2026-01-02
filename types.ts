
export interface Category {
  id: number;
  name: string;
  image: string;
  slug?: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  slug?: string;
  rating?: number;
  discount?: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  addressId: string;
}

export type SortOption = 'none' | 'low-high' | 'high-low';
