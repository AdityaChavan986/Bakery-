import express from 'express';
import { 
    addToCart, 
    updateCart, 
    getUserCart, 
    removeFromCart, 
    clearCart,
    getCartCount 
} from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/get', getUserCart)
cartRouter.post('/add', addToCart)
cartRouter.post('/update', updateCart)
cartRouter.post('/remove', removeFromCart)
cartRouter.post('/clear', clearCart)
cartRouter.post('/count', getCartCount)

export default cartRouter;