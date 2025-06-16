// routes/cartRoutes.js
import express from 'express';
import { addToCartHandler, getCartHandler, removeFromCartHandler } from '../controllers/cartControllers.js';
import { verifyTokenMiddleware } from '../services/authServices.js';

const router = express.Router();

router.post('/add', verifyTokenMiddleware, addToCartHandler);
router.get('/', verifyTokenMiddleware, getCartHandler);
router.delete('/remove/:productId', verifyTokenMiddleware, removeFromCartHandler);

export default router;
