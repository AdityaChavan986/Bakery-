import userModel from "../models/userModel.js";
import mongoose from "mongoose";

// Add product to user cart
const addToCart = async (req, res) => {
    try {
        console.log('addToCart called with req.body:', req.body);
        console.log('addToCart called with req.user:', req.user);
        
        // Get user from auth middleware and item details from request body
        const { itemId, quantity = 1 } = req.body;
        const userData = req.user; // User is already authenticated by auth middleware

        // Validate required fields
        if (!itemId) {
            console.log('Item ID is missing in request');
            return res.status(400).json({ 
                success: false, 
                message: 'Item ID is required' 
            });
        }

        // Validate quantity
        const qty = parseInt(quantity);
        if (isNaN(qty) || qty < 1) {
            console.log('Invalid quantity:', quantity);
            return res.status(400).json({ 
                success: false, 
                message: 'Quantity must be a positive number' 
            });
        }

        // User is already validated by auth middleware
        if (!userData) {
            console.log('No user data found in request');
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        console.log('User found:', userData.name, userData.email);
        console.log('User ID:', userData._id);
        console.log('Current cart data:', userData.cartData);
        
        let cartData = userData.cartData || {};

        // Add or update item quantity in cart
        console.log(`Adding/updating item ${itemId} with quantity ${qty}`);
        if (cartData[itemId]) {
            console.log(`Item ${itemId} already exists in cart with quantity ${cartData[itemId]}, updating to ${cartData[itemId] + qty}`);
            cartData[itemId] += qty;
        } else {
            console.log(`Item ${itemId} does not exist in cart, adding with quantity ${qty}`);
            cartData[itemId] = qty;
        }

        console.log('Updated cart data:', cartData);
        
        // Update user cart in database using the user's ID from the authenticated user object
        console.log(`Updating user ${userData._id} with cart data:`, cartData);
        const updateResult = await userModel.findByIdAndUpdate(userData._id, { cartData }, { new: true });
        console.log('Update result:', updateResult ? 'Success' : 'Failed');
        if (updateResult) {
            console.log('Updated user cart data:', updateResult.cartData);
        }

        console.log('Sending response to client:', { success: true, message: 'Item added to cart successfully', cartData });
        res.json({ 
            success: true, 
            message: 'Item added to cart successfully',
            cartData 
        });

    } catch (error) {
        console.error('addToCart error:', error);
        res.status(500).json({ 
            success: false, 
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
        });
    }
};

// Update product quantity in user cart
const updateCart = async (req, res) => {
    try {
        console.log('updateCart called with req.body:', req.body);
        console.log('updateCart called with req.user:', req.user);
        
        // Get user from auth middleware and item details from request body
        const { itemId, quantity } = req.body;
        const userData = req.user; // User is already authenticated by auth middleware

        // Validate required fields
        if (!itemId || quantity === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'Item ID and quantity are required' 
            });
        }

        // Validate quantity
        const qty = parseInt(quantity);
        if (isNaN(qty) || qty < 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Quantity must be a non-negative number' 
            });
        }

        // User is already validated by auth middleware
        if (!userData) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        let cartData = userData.cartData || {};
        console.log('Current cart data:', cartData);

        // Remove item if quantity is 0, otherwise update quantity
        if (qty === 0) {
            console.log(`Removing item ${itemId} from cart`);
            delete cartData[itemId];
        } else {
            console.log(`Updating item ${itemId} quantity to ${qty}`);
            cartData[itemId] = qty;
        }
        console.log('Updated cart data:', cartData);

        // Update user cart in database using the user's ID from the authenticated user object
        console.log(`Updating user ${userData._id} with cart data:`, cartData);
        const updateResult = await userModel.findByIdAndUpdate(userData._id, { cartData }, { new: true });
        console.log('Update result:', updateResult ? 'Success' : 'Failed');
        if (updateResult) {
            console.log('Updated user cart data:', updateResult.cartData);
        }

        res.json({ 
            success: true, 
            message: qty === 0 ? 'Item removed from cart' : 'Cart updated successfully',
            cartData 
        });

    } catch (error) {
        console.error('updateCart error:', error);
        res.status(500).json({ 
            success: false, 
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        console.log('removeFromCart called with req.body:', req.body);
        console.log('removeFromCart called with req.user:', req.user);
        
        // Get user from auth middleware and item details from request body
        const { itemId } = req.body;
        const userData = req.user; // User is already authenticated by auth middleware

        // Validate required fields
        if (!itemId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Item ID is required' 
            });
        }

        // User is already validated by auth middleware
        if (!userData) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        let cartData = userData.cartData || {};
        console.log('Current cart data:', cartData);

        // Remove item from cart
        if (cartData[itemId]) {
            console.log(`Removing item ${itemId} from cart`);
            delete cartData[itemId];
            
            // Update user cart in database using the user's ID from the authenticated user object
            console.log(`Updating user ${userData._id} with cart data:`, cartData);
            const updateResult = await userModel.findByIdAndUpdate(userData._id, { cartData }, { new: true });
            console.log('Update result:', updateResult ? 'Success' : 'Failed');
            if (updateResult) {
                console.log('Updated user cart data:', updateResult.cartData);
            }
            
            res.json({ 
                success: true, 
                message: 'Item removed from cart successfully',
                cartData 
            });
        } else {
            console.log(`Item ${itemId} not found in cart`);
            res.status(404).json({ 
                success: false, 
                message: 'Item not found in cart' 
            });
        }

    } catch (error) {
        console.error('removeFromCart error:', error);
        res.status(500).json({ 
            success: false, 
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
        });
    }
};

// Get user cart data
const getUserCart = async (req, res) => {
    try {
        console.log('getUserCart called with req.body:', req.body);
        console.log('getUserCart called with req.user:', req.user);
        
        // Get userId from request body or from authenticated user
        let userId = req.body && req.body.userId;
        
        // If userId is not provided in the body but user is authenticated
        if (!userId && req.user && req.user._id) {
            userId = req.user._id;
            console.log('Using userId from req.user._id:', userId);
        }

        // Validate required field
        if (!userId) {
            console.log('No userId found in request');
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        console.log('Looking up user with ID:', userId);
        
        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            console.log('User not found with ID:', userId);
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        console.log('User found:', userData.name, userData.email);
        
        // Get cart data from user document
        const cartData = userData.cartData || {};
        console.log('Cart data from database:', cartData);
        
        // Ensure the cart data is in the format expected by the frontend
        // The frontend expects an object with product IDs as keys and quantities as values
        // This is already how it's stored in the database, so we can just return it directly
        
        console.log('Sending cart data to client:', { success: true, cartData });
        res.json({ 
            success: true, 
            cartData
        });

    } catch (error) {
        console.error('getUserCart error:', error);
        res.status(500).json({ 
            success: false, 
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
        });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        console.log('clearCart called with req.body:', req.body);
        console.log('clearCart called with req.user:', req.user);
        
        // Get user from auth middleware
        const userData = req.user; // User is already authenticated by auth middleware

        // User is already validated by auth middleware
        if (!userData) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        console.log(`Clearing cart for user ${userData._id}`);
        
        // Clear cart using the user's ID from the authenticated user object
        const updateResult = await userModel.findByIdAndUpdate(userData._id, { cartData: {} }, { new: true });
        console.log('Update result:', updateResult ? 'Success' : 'Failed');
        
        res.json({ 
            success: true, 
            message: 'Cart cleared successfully',
            cartData: {} 
        });

    } catch (error) {
        console.error('clearCart error:', error);
        res.status(500).json({ 
            success: false, 
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
        });
    }
};

// Get cart item count
const getCartCount = async (req, res) => {
    try {
        console.log('getCartCount called with req.body:', req.body);
        console.log('getCartCount called with req.user:', req.user);
        
        // Get user from auth middleware
        const userData = req.user; // User is already authenticated by auth middleware

        // User is already validated by auth middleware
        if (!userData) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }
        
        console.log(`Getting cart count for user ${userData._id}`);


        const cartData = userData.cartData || {};
        
        // Calculate total items in cart
        const totalItems = Object.values(cartData).reduce((total, quantity) => total + quantity, 0);

        res.json({ 
            success: true, 
            count: totalItems,
            uniqueItems: Object.keys(cartData).length 
        });

    } catch (error) {
        console.error('getCartCount error:', error);
        res.status(500).json({ 
            success: false, 
            message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message 
        });
    }
};

export { 
    addToCart, 
    updateCart, 
    removeFromCart, 
    getUserCart, 
    clearCart, 
    getCartCount 
};