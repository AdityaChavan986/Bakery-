import api from './api';

// Interface for cart data from backend
interface CartData {
  [productId: string]: number; // productId: quantity
}

// Interface for cart API responses
interface CartResponse {
  success: boolean;
  message?: string;
  cartData?: CartData;
}

/**
 * Add a product to the user's cart
 * @param userId The ID of the user
 * @param productId The ID of the product to add
 * @param quantity The quantity to add (default: 1)
 */
export const addToCart = async (userId: number | string, productId: string | number, quantity: number = 1): Promise<CartResponse> => {
  try {
    const response = await api.post('/cart/add', {
      userId: userId.toString(), // Convert userId to string for MongoDB
      itemId: productId,
      quantity
    });
    return response.data;
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add item to cart'
    };
  }
};

/**
 * Update the quantity of a product in the user's cart
 * @param userId The ID of the user
 * @param productId The ID of the product to update
 * @param quantity The new quantity (0 to remove)
 */
export const updateCartItem = async (userId: number | string, productId: string | number, quantity: number): Promise<CartResponse> => {
  try {
    const response = await api.post('/cart/update', {
      userId: userId.toString(), // Convert userId to string for MongoDB
      itemId: productId,
      quantity
    });
    return response.data;
  } catch (error: any) {
    console.error('Error updating cart:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update cart'
    };
  }
};

/**
 * Remove a product from the user's cart
 * @param userId The ID of the user
 * @param productId The ID of the product to remove
 */
export const removeFromCart = async (userId: number | string, productId: string | number): Promise<CartResponse> => {
  try {
    const response = await api.post('/cart/remove', {
      userId: userId.toString(), // Convert userId to string for MongoDB
      itemId: productId
    });
    return response.data;
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove item from cart'
    };
  }
};

/**
 * Get the user's cart data
 * @param userId The ID of the user
 */
export const getUserCart = async (userId: number | string): Promise<CartResponse> => {
  try {
    const response = await api.post('/cart/get', {
      userId: userId.toString() // Convert userId to string for MongoDB
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting cart:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get cart data'
    };
  }
};

/**
 * Clear the user's cart
 * @param userId The ID of the user
 */
export const clearCart = async (userId: number | string): Promise<CartResponse> => {
  try {
    const response = await api.post('/cart/clear', {
      userId: userId.toString() // Convert userId to string for MongoDB
    });
    return response.data;
  } catch (error: any) {
    console.error('Error clearing cart:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to clear cart'
    };
  }
};

/**
 * Get the count of items in the user's cart
 * @param userId The ID of the user
 */
export const getCartCount = async (userId: number | string): Promise<{success: boolean; count?: number; uniqueItems?: number; message?: string}> => {
  try {
    const response = await api.post('/cart/count', {
      userId: userId.toString() // Convert userId to string for MongoDB
    });
    return response.data;
  } catch (error: any) {
    console.error('Error getting cart count:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get cart count'
    };
  }
};
