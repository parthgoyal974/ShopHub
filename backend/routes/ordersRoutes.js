// routes/orderRoutes.js

import express from 'express';
import { fetchOrdersByUserHandler, placeOrderHandler } from '../controllers/orderControllers.js';
import { verifyTokenMiddleware } from '../services/authServices.js';

const router = express.Router();

// Get all orders for the authenticated user
router.get('/', verifyTokenMiddleware, fetchOrdersByUserHandler);

// Place a new order for the authenticated user (from their cart)
router.post('/place', verifyTokenMiddleware, placeOrderHandler);

export default router;
