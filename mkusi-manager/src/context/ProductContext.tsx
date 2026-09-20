'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  images?: string[];
  description: string;
  compatibility: string;
  discountType?: 'percent' | 'fixed' | null;
  discountValue?: number | null;
  specs?: {
    color?: string;
    material?: string;
    power?: string;
    connector?: string;
    type?: string;
  };
}

export interface OrderLineItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  items: string;
  lineItems?: OrderLineItem[];
  total: string;
  phone: string;
  address: string;
  status: 'Pending' | 'Delivered';
  date: string;
  createdAt: string;
  removedAt?: string | null;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface StoreSettings {
  deliveryFee: number;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeWebsite: string;
  currency: string;
}

interface ProductContextType {
  products: Product[];
  productsLoading: boolean;
  orders: Order[];
  ordersLoading: boolean;
  cartItems: CartItem[];
  cartLoading: boolean;
  wishlist: number[];
  wishlistLoading: boolean;
  globalSearch: string;
  setGlobalSearch: (val: string) => void;
  storeSettings: StoreSettings;
  storeSettingsLoading: boolean;
  updateStoreSettings: (updates: Partial<StoreSettings>) => Promise<{ success: boolean; error?: string }>;
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Promise<{ success: boolean; product?: Product; error?: string }>;
  updateProduct: (id: number, updates: Partial<Omit<Product, 'id'>>) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: number) => Promise<{ success: boolean; error?: string }>;
  deleteAllProducts: () => Promise<{ success: boolean; error?: string }>;
  addOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'createdAt' | 'total' | 'items'> & { lineItems: OrderLineItem[]; totalOverride?: number; promoCode?: string }) => Promise<{ success: boolean; order?: Order; error?: string }>;
  toggleOrderStatus: (id: string) => Promise<{ success: boolean; error?: string }>;
  setOrderStatus: (id: string, status: 'Pending' | 'Delivered') => Promise<{ success: boolean; error?: string }>;
  clearOrders: () => Promise<{ success: boolean; error?: string }>;
  removeOrder: (id: string) => Promise<{ success: boolean; error?: string }>;
  restoreOrder: (id: string) => Promise<{ success: boolean; error?: string }>;
  addToCart: (productId: number, quantity?: number) => Promise<{ success: boolean; message?: string }>;
  updateCartQty: (productId: number, delta: number) => Promise<{ success: boolean; message?: string }>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  toggleWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  validatePromoCode: (code: string) => Promise<{ valid: boolean; discountType?: 'percent' | 'fixed'; discountValue?: number; error?: string }>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface OrderRow {
  id: string;
  customer_name: string;
  customer_email: string | null;
  items: string;
  total: string;
  phone: string;
  address: string;
  status: string;
  date: string;
  created_at: string;
  removed_at: string | null;
}

function mapOrderRow(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email || undefined,
    items: row.items,
    total: row.total,
    phone: row.phone,
    address: row.address,
    status: row.status as 'Pending' | 'Delivered',
    date: row.date,
    createdAt: row.created_at,
    removedAt: row.removed_at,
  };
}

function mapProductRow(row: any): Product {
  return {
    ...row,
    discountType: row.discount_type,
    discountValue: row.discount_value,
  };
}

export function getDiscountedPrice(product: Product): { finalPrice: number; hasDiscount: boolean; originalPrice: number } {
  const originalPrice = product.price;
  if (!product.discountType || !product.discountValue) {
    return { finalPrice: originalPrice, hasDiscount: false, originalPrice };
  }

  let finalPrice = originalPrice;
  if (product.discountType === 'percent') {
    finalPrice = originalPrice * (1 - product.discountValue / 100);
  } else if (product.discountType === 'fixed') {
    finalPrice = Math.max(0, originalPrice - product.discountValue);
  }

  return { finalPrice: Math.round(finalPrice * 100) / 100, hasDiscount: true, originalPrice };
}

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  deliveryFee: 20,
  storeName: '',
  storeEmail: '',
  storePhone: '',
  storeAddress: '',
  storeWebsite: '',
  currency: 'GHS',
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const { currentUser, authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [storeSettingsLoading, setStoreSettingsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchStoreSettings();
  }, []);

  // Realtime: orders
  useEffect(() => {
    const existing = supabase.getChannels().find(ch => ch.topic === 'realtime:orders-realtime');
    if (existing) supabase.removeChannel(existing);

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newOrder = mapOrderRow(payload.new as OrderRow);
          setOrders(prev => prev.some(o => o.id === newOrder.id) ? prev : [newOrder, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapOrderRow(payload.new as OrderRow);
          setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
        } else if (payload.eventType === 'DELETE') {
          const deletedId = (payload.old as { id: string }).id;
          setOrders(prev => prev.filter(o => o.id !== deletedId));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Realtime: products
  useEffect(() => {
    const existing = supabase.getChannels().find(ch => ch.topic === 'realtime:products-realtime');
    if (existing) supabase.removeChannel(existing);

    const channel = supabase
      .channel('products-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const newProduct = mapProductRow(payload.new);
          setProducts(prev => prev.some(p => p.id === newProduct.id) ? prev : [newProduct, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const updated = mapProductRow(payload.new);
          setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        } else if (payload.eventType === 'DELETE') {
          const deletedId = (payload.old as { id: number }).id;
          setProducts(prev => prev.filter(p => p.id !== deletedId));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchProducts = async () => {
    setProductsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to fetch products:', error.message);
      setProducts([]);
    } else {
      setProducts((data || []).map(mapProductRow));
    }
    setProductsLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Failed to fetch orders:', error.message);
      setOrders([]);
    } else {
      setOrders((data as OrderRow[]).map(mapOrderRow));
    }
    setOrdersLoading(false);
  };

  const fetchStoreSettings = async () => {
    setStoreSettingsLoading(true);
    const { data, error } = await supabase
      .from('settings')
      .select('delivery_fee, store_name, store_email, store_phone, store_address, store_website, currency')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Failed to fetch store settings:', error.message);
    } else if (data) {
      setStoreSettings({
        deliveryFee: Number(data.delivery_fee),
        storeName: data.store_name || '',
        storeEmail: data.store_email || '',
        storePhone: data.store_phone || '',
        storeAddress: data.store_address || '',
        storeWebsite: data.store_website || '',
        currency: data.currency || 'GHS',
      });
    }
    setStoreSettingsLoading(false);
  };

  const updateStoreSettings: ProductContextType['updateStoreSettings'] = async (updates) => {
    const dbUpdates: Record<string, string | number> = { updated_at: new Date().toISOString() };
    if (updates.deliveryFee !== undefined) dbUpdates.delivery_fee = updates.deliveryFee;
    if (updates.storeName !== undefined) dbUpdates.store_name = updates.storeName;
    if (updates.storeEmail !== undefined) dbUpdates.store_email = updates.storeEmail;
    if (updates.storePhone !== undefined) dbUpdates.store_phone = updates.storePhone;
    if (updates.storeAddress !== undefined) dbUpdates.store_address = updates.storeAddress;
    if (updates.storeWebsite !== undefined) dbUpdates.store_website = updates.storeWebsite;
    if (updates.currency !== undefined) dbUpdates.currency = updates.currency;

    const { error } = await supabase.from('settings').update(dbUpdates).eq('id', 1);
    if (error) {
      console.error('Failed to update store settings:', error.message);
      return { success: false, error: error.message };
    }
    setStoreSettings(prev => ({ ...prev, ...updates }));
    return { success: true };
  };

  const validatePromoCode: ProductContextType['validatePromoCode'] = async (code) => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) return { valid: false, error: 'Enter a promo code.' };

    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', trimmedCode)
      .single();

    if (error || !data) {
      return { valid: false, error: 'Invalid promo code.' };
    }

    if (!data.active) {
      return { valid: false, error: 'This code is no longer active.' };
    }

    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return { valid: false, error: 'This code has expired.' };
    }

    if (data.usage_limit !== null && data.times_used >= data.usage_limit) {
      return { valid: false, error: 'This code has reached its usage limit.' };
    }

    return {
      valid: true,
      discountType: data.discount_type,
      discountValue: Number(data.discount_value),
    };
  };

  // ─── CART & WISHLIST: account-synced when logged in, in-memory when a guest ───

  useEffect(() => {
    if (authLoading) return;

    if (!currentUser) {
      setCartLoading(false);
      setWishlistLoading(false);
      return;
    }

    if (currentUser.isAdmin) {
      setCartItems([]);
      setWishlist([]);
      setCartLoading(false);
      setWishlistLoading(false);
      return;
    }

    (async () => {
      setCartLoading(true);
      setWishlistLoading(true);

      const guestCart = cartItems;
      const guestWishlist = wishlist;

      const [{ data: cartRows, error: cartError }, { data: wishlistRows, error: wishlistError }] = await Promise.all([
        supabase.from('cart_items').select('product_id, quantity').eq('user_id', currentUser.id),
        supabase.from('wishlist_items').select('product_id').eq('user_id', currentUser.id),
      ]);

      let mergedCart: CartItem[] = cartError || !cartRows
        ? []
        : cartRows.map(r => ({ productId: r.product_id, quantity: r.quantity }));

      let mergedWishlist: number[] = wishlistError || !wishlistRows
        ? []
        : wishlistRows.map(r => r.product_id);

      if (guestCart.length > 0) {
        for (const guestItem of guestCart) {
          const existing = mergedCart.find(c => c.productId === guestItem.productId);
          if (existing) {
            existing.quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        }
        await Promise.all(mergedCart.map(item =>
          supabase.from('cart_items').upsert(
            { user_id: currentUser.id, product_id: item.productId, quantity: item.quantity },
            { onConflict: 'user_id,product_id' }
          )
        ));
      }

      if (guestWishlist.length > 0) {
        const toAdd = guestWishlist.filter(id => !mergedWishlist.includes(id));
        if (toAdd.length > 0) {
          mergedWishlist = [...mergedWishlist, ...toAdd];
          await Promise.all(toAdd.map(productId =>
            supabase.from('wishlist_items').upsert(
              { user_id: currentUser.id, product_id: productId },
              { onConflict: 'user_id,product_id' }
            )
          ));
        }
      }

      setCartItems(mergedCart);
      setWishlist(mergedWishlist);
      setCartLoading(false);
      setWishlistLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id, authLoading]);

  const addToCart: ProductContextType['addToCart'] = async (productId, quantity = 1) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Product not found.' };

    const existing = cartItems.find(item => item.productId === productId);
    const currentQty = existing?.quantity || 0;
    const desiredQty = currentQty + quantity;
    const cappedQty = Math.min(desiredQty, product.stock);

    if (cappedQty <= 0) {
      return { success: false, message: 'This item is out of stock.' };
    }

    const newCartItems = existing
      ? cartItems.map(item => item.productId === productId ? { ...item, quantity: cappedQty } : item)
      : [...cartItems, { productId, quantity: cappedQty }];

    setCartItems(newCartItems);

    if (currentUser && !currentUser.isAdmin) {
      const { error } = await supabase.from('cart_items').upsert(
        { user_id: currentUser.id, product_id: productId, quantity: cappedQty },
        { onConflict: 'user_id,product_id' }
      );
      if (error) console.error('Failed to sync cart:', error.message);
    }

    if (cappedQty < desiredQty) {
      return { success: true, message: `Only ${product.stock} in stock — quantity capped.` };
    }
    return { success: true };
  };

  const updateCartQty: ProductContextType['updateCartQty'] = async (productId, delta) => {
    const product = products.find(p => p.id === productId);
    const existing = cartItems.find(item => item.productId === productId);
    if (!existing) return { success: false, message: 'Item not in cart.' };

    const maxQty = product?.stock ?? existing.quantity;
    const nextQty = Math.max(1, existing.quantity + delta);
    const cappedQty = Math.min(nextQty, maxQty);

    setCartItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity: cappedQty } : item));

    if (currentUser && !currentUser.isAdmin) {
      const { error } = await supabase.from('cart_items').upsert(
        { user_id: currentUser.id, product_id: productId, quantity: cappedQty },
        { onConflict: 'user_id,product_id' }
      );
      if (error) console.error('Failed to sync cart:', error.message);
    }

    if (delta > 0 && cappedQty < nextQty) {
      return { success: true, message: `Only ${maxQty} in stock.` };
    }
    return { success: true };
  };

  const removeFromCart: ProductContextType['removeFromCart'] = async (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));

    if (currentUser && !currentUser.isAdmin) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('product_id', productId);
      if (error) console.error('Failed to remove cart item:', error.message);
    }
  };

  const clearCart: ProductContextType['clearCart'] = async () => {
    setCartItems([]);

    if (currentUser && !currentUser.isAdmin) {
      const { error } = await supabase.from('cart_items').delete().eq('user_id', currentUser.id);
      if (error) console.error('Failed to clear cart:', error.message);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const toggleWishlist: ProductContextType['toggleWishlist'] = async (productId) => {
    const isIn = wishlist.includes(productId);
    setWishlist(prev => isIn ? prev.filter(id => id !== productId) : [...prev, productId]);

    if (currentUser && !currentUser.isAdmin) {
      if (isIn) {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('product_id', productId);
        if (error) console.error('Failed to remove wishlist item:', error.message);
      } else {
        const { error } = await supabase.from('wishlist_items').upsert(
          { user_id: currentUser.id, product_id: productId },
          { onConflict: 'user_id,product_id' }
        );
        if (error) console.error('Failed to sync wishlist:', error.message);
      }
    }
  };

  const isInWishlist = (productId: number) => wishlist.includes(productId);

  // ─── Products, orders ───

  const addProduct: ProductContextType['addProduct'] = async (newProd) => {
    const status = newProd.stock > 0 ? 'Active' : 'Out of Stock';
    const { discountType, discountValue, ...rest } = newProd;
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...rest,
        status,
        discount_type: discountType || null,
        discount_value: discountValue || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Failed to add product:', error.message);
      return { success: false, error: error.message };
    }

    const mapped = mapProductRow(data);
    setProducts(prev => [mapped, ...prev]);
    return { success: true, product: mapped };
  };

  const updateProduct: ProductContextType['updateProduct'] = async (id, updates) => {
    const { discountType, discountValue, ...rest } = updates;
    const dbUpdates: Record<string, unknown> = { ...rest };
    if (discountType !== undefined) dbUpdates.discount_type = discountType || null;
    if (discountValue !== undefined) dbUpdates.discount_value = discountValue || null;

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update product:', error.message);
      return { success: false, error: error.message };
    }

    const mapped = mapProductRow(data);
    setProducts(prev => prev.map(p => p.id === id ? mapped : p));
    return { success: true };
  };

  const deleteProduct: ProductContextType['deleteProduct'] = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete product:', error.message);
      return { success: false, error: error.message };
    }
    setProducts(prev => prev.filter(p => p.id !== id));
    setWishlist(prev => prev.filter(pid => pid !== id));
    return { success: true };
  };

  const deleteAllProducts: ProductContextType['deleteAllProducts'] = async () => {
    const { error } = await supabase.from('products').delete().gt('id', 0);
    if (error) {
      console.error('Failed to reset inventory:', error.message);
      return { success: false, error: error.message };
    }
    setProducts([]);
    setWishlist([]);
    return { success: true };
  };

  const addOrder: ProductContextType['addOrder'] = async (orderData) => {
    const insufficientItems: string[] = [];
    const adjustedLines: { productId: number; quantity: number; product: Product }[] = [];

    for (const line of orderData.lineItems) {
      const product = products.find(p => p.id === line.productId);
      if (!product) {
        insufficientItems.push(`Item no longer available (removed)`);
        continue;
      }
      if (product.stock <= 0) {
        insufficientItems.push(`${product.name} is now out of stock`);
        continue;
      }
      const cappedQty = Math.min(line.quantity, product.stock);
      if (cappedQty < line.quantity) {
        insufficientItems.push(`${product.name}: only ${product.stock} left, requested ${line.quantity}`);
      }
      adjustedLines.push({ productId: line.productId, quantity: cappedQty, product });
    }

    if (adjustedLines.length === 0) {
      return { success: false, error: 'None of the items in your cart are currently available.' };
    }

    const lineItemsTotal = adjustedLines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const finalTotal = orderData.totalOverride ?? lineItemsTotal;
    const itemsSummary = adjustedLines.map(l => `${l.quantity}x ${l.product.name}`).join(', ');

    let promoRow: { id: number; times_used: number } | null = null;
    if (orderData.promoCode) {
      const { data: promoData, error: promoError } = await supabase
        .from('promo_codes')
        .select('id, active, expires_at, usage_limit, times_used')
        .eq('code', orderData.promoCode.trim().toUpperCase())
        .single();

      if (promoError || !promoData) {
        return { success: false, error: 'Promo code is no longer valid.' };
      }
      if (!promoData.active) {
        return { success: false, error: 'This promo code is no longer active.' };
      }
      if (promoData.expires_at && new Date(promoData.expires_at) < new Date()) {
        return { success: false, error: 'This promo code has expired.' };
      }
      if (promoData.usage_limit !== null && promoData.times_used >= promoData.usage_limit) {
        return { success: false, error: 'This promo code has reached its usage limit.' };
      }
      promoRow = promoData;
    }

    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const id = `MK-${part1}-${part2}`;
    const date = new Date().toLocaleDateString();

    const { data, error } = await supabase.from('orders').insert([{
      id,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail || null,
      items: itemsSummary,
      total: `GH₵ ${finalTotal.toFixed(2)}`,
      phone: orderData.phone,
      address: orderData.address,
      status: 'Pending',
      date,
    }]).select().single();

    if (error) {
      console.error('Failed to place order:', error.message);
      return { success: false, error: error.message };
    }

    if (promoRow) {
      const { error: promoUpdateError } = await supabase
        .from('promo_codes')
        .update({ times_used: promoRow.times_used + 1 })
        .eq('id', promoRow.id);
      if (promoUpdateError) {
        console.error('Failed to increment promo code usage:', promoUpdateError.message);
      }
    }

    for (const line of adjustedLines) {
      const newStock = Math.max(0, line.product.stock - line.quantity);
      const newStatus = newStock > 0 ? 'Active' : 'Out of Stock';
      const { error: stockError } = await supabase.from('products').update({ stock: newStock, status: newStatus }).eq('id', line.productId);
      if (stockError) {
        console.error(`Failed to decrement stock for product ${line.productId}:`, stockError.message);
        continue;
      }
      setProducts(prev => prev.map(p => p.id === line.productId ? { ...p, stock: newStock, status: newStatus } : p));
    }

    const newOrder = mapOrderRow(data as OrderRow);
    setOrders(prev => prev.some(o => o.id === newOrder.id) ? prev : [newOrder, ...prev]);

    if (insufficientItems.length > 0) {
      return { success: true, order: newOrder, error: `Order placed, but some items were adjusted: ${insufficientItems.join('; ')}` };
    }
    return { success: true, order: newOrder };
  };

  const toggleOrderStatus: ProductContextType['toggleOrderStatus'] = async (id) => {
    const current = orders.find(o => o.id === id);
    if (!current) return { success: false, error: 'Order not found.' };
    const newStatus = current.status === 'Pending' ? 'Delivered' : 'Pending';
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) {
      console.error('Failed to update order status:', error.message);
      return { success: false, error: error.message };
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    return { success: true };
  };

  const setOrderStatus: ProductContextType['setOrderStatus'] = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) {
      console.error('Failed to update order status:', error.message);
      return { success: false, error: error.message };
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    return { success: true };
  };

  const clearOrders: ProductContextType['clearOrders'] = async () => {
    const { error } = await supabase.from('orders').delete().neq('id', '');
    if (error) {
      console.error('Failed to clear orders:', error.message);
      return { success: false, error: error.message };
    }
    setOrders([]);
    return { success: true };
  };

  const removeOrder: ProductContextType['removeOrder'] = async (id) => {
    const timestamp = new Date().toISOString();
    const { error } = await supabase.from('orders').update({ removed_at: timestamp }).eq('id', id);
    if (error) {
      console.error('Failed to remove order:', error.message);
      return { success: false, error: error.message };
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, removedAt: timestamp } : o));
    return { success: true };
  };

  const restoreOrder: ProductContextType['restoreOrder'] = async (id) => {
    const { error } = await supabase.from('orders').update({ removed_at: null }).eq('id', id);
    if (error) {
      console.error('Failed to restore order:', error.message);
      return { success: false, error: error.message };
    }
    setOrders(prev => prev.map(o => o.id === id ? { ...o, removedAt: null } : o));
    return { success: true };
  };

  return (
    <ProductContext.Provider value={{
      products, productsLoading, orders, ordersLoading,
      cartItems, cartLoading, wishlist, wishlistLoading,
      globalSearch, setGlobalSearch,
      storeSettings, storeSettingsLoading, updateStoreSettings,
      addProduct, updateProduct, deleteProduct, deleteAllProducts,
      addOrder, toggleOrderStatus, setOrderStatus, clearOrders, removeOrder, restoreOrder,
      addToCart, updateCartQty, removeFromCart, clearCart, cartCount,
      toggleWishlist, isInWishlist, validatePromoCode
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