import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  current_price: number;
  store: string;
}

interface SharedCart {
  id: number;
  name: string;
  items: CartItem[];
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface PriceUpdate {
  productId: number;
  newPrice: number;
}

interface CartUpdate {
  cartId: number;
  items: CartItem[];
}

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

export default function Popup() {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [priceComparisons, setPriceComparisons] = useState<Product[]>([]);
  const [sharedCarts, setSharedCarts] = useState<SharedCart[]>([]);
  const [activeCoupons, setActiveCoupons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    let socket: Socket | null = null;

    const initializeSocket = () => {
      try {
        socket = io('http://localhost:8000', {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 10000,
          withCredentials: true,
          extraHeaders: {
            'Access-Control-Allow-Credentials': 'true'
          }
        });

        socket.on('connect', () => {
          console.log('Connected to WebSocket server');
          setSocketConnected(true);
          setError(null);
          fetchCurrentProduct();
        });

        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setSocketConnected(false);
          setError('Unable to connect to real-time updates. Retrying...');
        });

        socket.on('disconnect', (reason) => {
          console.log('Disconnected from WebSocket server:', reason);
          setSocketConnected(false);
          if (reason === 'io server disconnect') {
            socket?.connect();
          }
        });

        // Handle price updates
        socket.on('price_update', (update: PriceUpdate) => {
          setPriceComparisons(prev => 
            prev.map(product => 
              product.id === update.productId 
                ? { ...product, current_price: update.newPrice }
                : product
            )
          );
        });

        // Handle cart updates
        socket.on('cart_update', (update: CartUpdate) => {
          setSharedCarts(prev => 
            prev.map(cart => 
              cart.id === update.cartId 
                ? { ...cart, items: update.items }
                : cart
            )
          );
        });
      } catch (err) {
        console.error('Socket initialization error:', err);
        setError('Failed to initialize real-time updates');
      }
    };

    const fetchCurrentProduct = async () => {
      try {
        if (window.chrome && window.chrome.tabs) {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tab.url) {
            const response = await axios.post('http://localhost:8000/api/products/current', {
              url: tab.url
            });
            setCurrentProduct(response.data);
            fetchPriceComparisons(response.data.id);
          }
        }
      } catch (err) {
        console.error('Error fetching current product:', err);
        setError('Failed to fetch product information');
      } finally {
        setLoading(false);
      }
    };

    const fetchPriceComparisons = async (productId: number) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${productId}/comparisons`);
        setPriceComparisons(response.data);
      } catch (err) {
        console.error('Error fetching price comparisons:', err);
      }
    };

    initializeSocket();
    
    return () => {
      socket?.disconnect();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white shadow-lg text-gray-800 text-sm">
      {/* Menu Items */}
      <div className="divide-y divide-gray-200">
        {/* Current Product */}
        <div className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
          <div className="w-5 h-5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="flex-1 truncate">
            {currentProduct ? (
              <span>{currentProduct.name}</span>
            ) : (
              <span className="text-gray-500">No product selected</span>
            )}
          </div>
        </div>

        {/* Price Comparisons */}
        <div className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
          <div className="w-5 h-5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="flex-1">Price Comparisons</div>
          <div className="text-gray-400">{priceComparisons.length}</div>
        </div>

        {/* Active Coupons */}
        <div className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
          <div className="w-5 h-5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div className="flex-1">Available Coupons</div>
          <div className="text-gray-400">{activeCoupons.length}</div>
        </div>

        {/* Shared Carts */}
        <div className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
          <div className="w-5 h-5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1">Shared Carts</div>
          <div className="text-gray-400">{sharedCarts.length}</div>
        </div>

        {/* Divider for system options */}
        <div className="h-px bg-gray-200" />

        {/* Help */}
        <div className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
          <div className="w-5 h-5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">Help</div>
        </div>

        {/* Options */}
        <div className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer">
          <div className="w-5 h-5 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1">Options</div>
        </div>
      </div>

      {/* Connection Status */}
      {!socketConnected && (
        <div className="p-2 bg-yellow-50 border-t border-yellow-100">
          <p className="text-yellow-600 text-xs text-center">
            ⚠️ Offline Mode
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2 bg-red-50 border-t border-red-100">
          <p className="text-red-600 text-xs text-center">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
