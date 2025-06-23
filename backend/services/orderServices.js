// services/orderServices.js

import Order from '../models/order.js';
import OrderItem from '../models/orderItem.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import CartItem from '../models/cartItem.js';
import sequelize from '../lib/db.js';

// Fetch all orders for a user, including items and product details
export const getOrdersByUser = async (userId) => {
  return await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        include: [Product]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

import Sequelize from "sequelize"; // Make sure Sequelize is imported

export const placeOrderForUser = async (userId) => {
  return await sequelize.transaction(
    {
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE, // strictest isolation
    },
    async (t) => {
      // Lock the cart row for this user
      const cart = await Cart.findOne({
        where: { userId },
        transaction: t,
        lock: t.LOCK.UPDATE, // <-- This locks the cart row
      });
      if (!cart) throw new Error("Cart not found");

      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [Product],
        transaction: t,
        lock: t.LOCK.UPDATE, // lock cart items as well
      });
      if (!cartItems.length) throw new Error("Cart is empty");

      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const order = await Order.create(
        { userId, total, status: "completed" },
        { transaction: t }
      );

      await OrderItem.bulkCreate(
        cartItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
        { transaction: t }
      );

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

      return await Order.findByPk(order.id, {
        include: [{ model: OrderItem, include: [Product] }],
        transaction: t,
      });
    }
  );
};

