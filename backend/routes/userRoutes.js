import express from 'express';
import { loginUser, registerUser, adminLogin, findUserByEmail } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.post('/find-by-email', findUserByEmail);


export default userRouter;