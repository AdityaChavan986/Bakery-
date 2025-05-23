import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';
import * as cartService from '../services/cartService';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, isAuthenticated } = useAuth();
  
  // Load cart data when user logs in
  useEffect(() => {
    const fetchCartData = async () => {
      if (isAuthenticated && user) {
        setIsLoading(true);
        try {
          const response = await cartService.getUserCart(user.id);
          if (response.success && response.cartData) {
            // Convert backend cart data to frontend format
            const cartItems: CartItem[] = [];
            
            // We need to fetch product details for each item in the cart
            // For now, we'll use localStorage as a fallback
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
              const localCartItems: CartItem[] = JSON.parse(savedCart);
              
              // Filter local cart items to match backend cart data
              for (const item of localCartItems) {
                const productId = item.product.id.toString();
                if (response.cartData[productId]) {
                  cartItems.push({
                    product: item.product,
                    quantity: response.cartData[productId]
                  });
                }
              }
              
              setItems(cartItems);
            }
          }
        } catch (error) {
          console.error('Error fetching cart data:', error);
          // Fallback to localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        // Not authenticated, use localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      }
    };
    
    fetchCartData();
  }, [isAuthenticated, user]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = async (product: Product) => {
    try {
      setIsLoading(true);
      
      // Update local state first for immediate UI feedback
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
          return currentItems.map(item => 
            item.product.id === product.id 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          );
        }
        
        return [...currentItems, { product, quantity: 1 }];
      });
      
      // If user is authenticated, update backend
      if (isAuthenticated && user) {
        const response = await cartService.addToCart(user.id, product.id);
        if (!response.success) {
          toast.error(response.message || 'Failed to add item to cart');
          // Revert local state if backend update fails
          setItems(currentItems => {
            const existingItem = currentItems.find(item => item.product.id === product.id);
            
            if (existingItem && existingItem.quantity > 1) {
              return currentItems.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity - 1 } 
                  : item
              );
            }
            
            return currentItems.filter(item => item.product.id !== product.id);
          });
        } else {
          toast.success('Item added to cart');
        }
      } else {
        toast.success('Item added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: number | string) => {
    try {
      setIsLoading(true);
      
      // Update local state first
      setItems(currentItems => currentItems.filter(item => item.product.id !== productId));
      
      // If user is authenticated, update backend
      if (isAuthenticated && user) {
        const response = await cartService.removeFromCart(user.id, productId);
        if (!response.success) {
          toast.error(response.message || 'Failed to remove item from cart');
          // No need to revert state as the item was already removed
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: number | string, quantity: number) => {
    try {
      setIsLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }
      
      // Update local state first
      setItems(currentItems => 
        currentItems.map(item => 
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
      
      // If user is authenticated, update backend
      if (isAuthenticated && user) {
        const response = await cartService.updateCartItem(user.id, productId, quantity);
        if (!response.success) {
          toast.error(response.message || 'Failed to update cart');
          // Revert local state if backend update fails
          setItems(prevItems => {
            const prevItem = prevItems.find(item => item.product.id === productId);
            if (!prevItem) return prevItems;
            
            return prevItems.map(item => 
              item.product.id === productId 
                ? { ...item, quantity: prevItem.quantity } 
                : item
            );
          });
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      
      // Update local state first
      setItems([]);
      
      // If user is authenticated, update backend
      if (isAuthenticated && user) {
        const response = await cartService.clearCart(user.id);
        if (!response.success) {
          toast.error(response.message || 'Failed to clear cart');
        }
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        totalItems,
        totalPrice,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};