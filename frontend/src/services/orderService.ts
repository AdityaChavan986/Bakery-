import api from './api';

// Interface for order data
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: string;
  paymentMethod: string;
  payment: boolean;
  date: number;
}

// Interface for order API responses
interface OrderResponse {
  success: boolean;
  orders?: Order[];
  message?: string;
}

/**
 * Get orders for the current user
 */
export const getUserOrders = async (): Promise<OrderResponse> => {
  try {
    // Use GET request since we're not sending any data in the body
    // The user ID will be extracted from the JWT token on the backend
    const response = await api.get('/orders/user-orders');
    console.log('Orders response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch orders'
    };
  }
};

/**
 * Format date from timestamp to readable format
 */
export const formatOrderDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get status badge color based on order status
 */
export const getStatusBadgeColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'order placed':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
