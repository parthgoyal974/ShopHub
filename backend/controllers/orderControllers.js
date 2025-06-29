// controllers/orderControllers.js

import { getOrdersByUser, placeOrderForUser } from '../services/orderServices.js';

// Fetch all orders for the authenticated user
export const fetchOrdersByUserHandler = async (req, res) => {
  try {
    const orders = await getOrdersByUser(req.userId);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Place an order for the authenticated user (from their cart)
export const placeOrderHandler = async (req, res) => {
  try {
    const { sessionId } = req.body; // Get session ID from frontend
    const order = await placeOrderForUser(req.userId, sessionId);
    res.status(201).json(order);
  } catch (err) {
    const status = err.message === "Cart is empty" ? 400 : 500;
    res.status(status).json({ message: err.message });
  }
};