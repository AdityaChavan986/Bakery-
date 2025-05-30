import express from 'express';
import {
  placedOrder,
  allOrders,
  userOrders,
  updateStatus
} from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Place an order using COD or other payment methods
router.post('/place', auth, placedOrder);

// Get orders for the authenticated user
router.get('/user-orders', auth, userOrders);

// Get all orders (for admin panel)
router.get('/all', allOrders);
router.put('/update-status', updateStatus);


export default router;
