// services/cartServices.js
import Cart from '../models/cart.js';
import CartItem from '../models/cartItem.js';
import Product from '../models/product.js';

export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) {
    cart = await Cart.create({ userId });
  }
  return cart;
};

export const addItemToCart = async (userId, productId, quantity = 1) => {
  const cart = await getOrCreateCart(userId);
  let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });
  if (item) {
    item.quantity += quantity;
    await item.save();
  } else {
    item = await CartItem.create({ cartId: cart.id, productId, quantity });
  }
  return item;
};

export const getCartItems = async (userId) => {
  const cart = await getOrCreateCart(userId);
  return await CartItem.findAll({
    where: { cartId: cart.id },
    include: [{ model: Product }]
  });
};

export const removeItemFromCart = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  return await CartItem.destroy({ where: { cartId: cart.id, productId } });
};


export const clearUserCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await CartItem.destroy({ where: { cartId: cart.id } });
};
