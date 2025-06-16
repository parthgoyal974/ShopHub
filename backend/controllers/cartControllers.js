// controllers/cartControllers.js
import { addItemToCart, getCartItems, removeItemFromCart } from '../services/cartServices.js';

export const addToCartHandler = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const item = await addItemToCart(req.userId, productId, quantity || 1);
    res.status(200).json(item);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

export const getCartHandler = async (req, res) => {
  try {
    const items = await getCartItems(req.userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromCartHandler = async (req, res) => {
  try {
    const { productId } = req.params;
    await removeItemFromCart(req.userId, productId);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
