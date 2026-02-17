'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;         // NEW
  price: number;
  stock: number;
  status: string;
  image: string;
  description: string;   // NEW
  compatibility: string; // NEW (e.g., "iPhone 13, Samsung S24")
  specs?: {              // NEW (Flexible storage for category specifics)
    color?: string;
    material?: string;
    power?: string;      // e.g., "20W"
    connector?: string;  // e.g., "USB-C"
    type?: string;       // e.g., "Wireless"
  };
}

export interface Order {
  id: string;
  customerName: string;
  items: string;
  total: string;
  phone: string;
  address: string;
  status: 'Pending' | 'Delivered';
  date: string;
}

interface ProductContextType {
  products: Product[];
  orders: Order[];
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'status'>) => void;
  addOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  toggleOrderStatus: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedProducts = localStorage.getItem('mkusi_products');
    const savedOrders = localStorage.getItem('mkusi_orders');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('mkusi_products', JSON.stringify(products));
      localStorage.setItem('mkusi_orders', JSON.stringify(orders));
    }
  }, [products, orders, isLoaded]);

  const addProduct = (newProd: Omit<Product, 'id' | 'status'>) => {
    const productWithId: Product = {
      ...newProd,
      id: Date.now(),
      status: newProd.stock > 0 ? 'Active' : 'Out of Stock'
    };
    setProducts((prev) => [...prev, productWithId]);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `MK-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString(),
      status: 'Pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const toggleOrderStatus = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'Pending' ? 'Delivered' : 'Pending' } : o));
  };

  return (
    <ProductContext.Provider value={{ 
      products, orders, globalSearch, setGlobalSearch, 
      addProduct, addOrder, toggleOrderStatus 
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};