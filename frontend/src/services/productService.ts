import api from './api';
import { Product } from '../types';

interface ProductsResponse {
  success: boolean;
  products: Product[];
}

export const productService = {
  /**
   * Fetch all products from the backend
   * @returns Promise with the products array
   */
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await api.get<ProductsResponse>('/products/list');
      return response.data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Fetch a single product by ID
   * @param id Product ID
   * @returns Promise with the product
   */
  getProductById: async (id: number): Promise<Product> => {
    try {
      const response = await api.get<{ success: boolean; product: Product }>(`/products/single/${id}`);
      return response.data.product;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }
};
