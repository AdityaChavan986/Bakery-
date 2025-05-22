import express from 'express';
import {
  placedOrder,
  allOrders,
  userOrders,
  updateStatus
} from '../controllers/orderController.js';

const router = express.Router();

// Place an order using COD
router.post('/place', placedOrder);
router.post('/user-orders', userOrders);

// Get all orders (for admin panel)
router.get('/all', allOrders);
router.put('/update-status', updateStatus);


export default router;
