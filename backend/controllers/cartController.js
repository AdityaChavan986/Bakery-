import userModel from "../models/userModel.js";

// Add product to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, quantity = 1 } = req.body;

        // Validate required fields
        if (!userId || !itemId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and Item ID are required' 
            });
        }

        // Validate quantity
        const qty = parseInt(quantity);
        if (isNaN(qty) || qty < 1) {
            return res.status(400).json({ 
                success: false, 
                message: 'Quantity must be a positive number' 
            });
        }

        // Find user and get cart data
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        let cartData = userData.cartData || {};

        // Add or update item quantity in cart
        if (cartData[itemId]) {
            cartData[itemId] += qty;
        } else {
            cartData[itemId] = qty;
        }

        // Update user cart in database
        await userModel.findByIdAndUpdate(userId, { cartData });

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
        const { userId, itemId, quantity } = req.body;

        // Validate required fields
        if (!userId || !itemId || quantity === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID, Item ID, and quantity are required' 
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

        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        let cartData = userData.cartData || {};

        // Remove item if quantity is 0, otherwise update quantity
        if (qty === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = qty;
        }

        // Update user cart in database
        await userModel.findByIdAndUpdate(userId, { cartData });

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
        const { userId, itemId } = req.body;

        // Validate required fields
        if (!userId || !itemId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID and Item ID are required' 
            });
        }

        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        let cartData = userData.cartData || {};

        // Remove item from cart
        if (cartData[itemId]) {
            delete cartData[itemId];
            
            // Update user cart in database
            await userModel.findByIdAndUpdate(userId, { cartData });
            
            res.json({ 
                success: true, 
                message: 'Item removed from cart successfully',
                cartData 
            });
        } else {
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
        const { userId } = req.body;

        // Validate required field
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        const cartData = userData.cartData || {};

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
        const { userId } = req.body;

        // Validate required field
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        // Clear cart
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

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
        const { userId } = req.body;

        // Validate required field
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        // Find user
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

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