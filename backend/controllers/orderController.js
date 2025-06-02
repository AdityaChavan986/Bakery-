import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Placing Order with any payment method
const placedOrder = async (req, res) => {
    try {
        // Get user from authenticated user object
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        
        // Get user ID, ensuring we use a consistent format
        const userId = user.id || user._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid user ID"
            });
        }
        
        const { items, amount, address, paymentMethod, payment } = req.body;
        
        console.log('User object:', user);
        console.log('Placing order for user ID:', userId);
        console.log('User ID type:', typeof userId);
        
        // Validate required fields
        if (!items || !amount || !address) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields for order placement" 
            });
        }

        // Create order data with the payment method from request (default to COD if not provided)
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "COD",
            payment: payment !== undefined ? payment : false,
            date: Date.now()
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Clear the user's cart after successful order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Return the order ID along with success message
        res.json({ 
            success: true, 
            message: "Order Placed Successfully",
            orderId: newOrder._id 
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// All order Data for Admin panel
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
    try {
        // Get user from the authenticated user object
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Get all possible user ID formats
        const userId = user.id || user._id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Invalid user ID' });
        }

        // Debug logs removed

        // Try to find orders with exact userId match
        let orders = await orderModel.find({ userId: userId });
        
        if (orders.length === 0) {
            // If no orders found, try with userId as string
            orders = await orderModel.find({ userId: userId.toString() });
        }
        
        // Send the orders to the client
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Error in userOrders:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Order Status for Admin panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        console.log(`Updating order status: orderId=${orderId}, status=${status}`);
        
        if (!orderId || !status) {
            return res.status(400).json({ 
                success: false, 
                message: "Order ID and status are required" 
            });
        }
        
        // Find the order first to make sure it exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }
        
        // Update the order status
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true } // Return the updated document
        );
        
        console.log('Order status updated successfully:', updatedOrder);
        
        res.json({ 
            success: true, 
            message: "Status Updated Successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { placedOrder, allOrders, userOrders, updateStatus };
