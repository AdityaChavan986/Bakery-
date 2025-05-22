import express from 'express';
import upload from '../middleware/multer.js'; 
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.single('image1'), addProduct);
productRouter.get('/list', listProducts);
productRouter.get('/single/:id', singleProduct);
productRouter.delete('/remove/:id', removeProduct);

export default productRouter;
