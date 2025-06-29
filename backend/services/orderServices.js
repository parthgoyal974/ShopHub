// services/orderServices.js

import Sequelize from 'sequelize';
import Order from '../models/order.js';
import OrderItem from '../models/orderItem.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import CartItem from '../models/cartItem.js';
import sequelize from '../lib/db.js';
import Stripe from 'stripe';

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




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrderForUser = async (userId, sessionId = null) => {
  return await sequelize.transaction(
    {
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
    },
    async (t) => {
      // Lock the cart row for this user
      const cart = await Cart.findOne({
        where: { userId },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!cart) throw new Error('Cart not found');

      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: [Product],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (!cartItems.length) throw new Error('Cart is empty');

      const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const order = await Order.create(
        { userId, total, status: 'completed' },
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

      // If sessionId is provided, retrieve Stripe session and store payment details
      if (sessionId) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['payment_intent', 'payment_intent.charges'],
          });

          // Store payment intent ID if available
          if (session.payment_intent?.id) {
            order.paymentIntentId = session.payment_intent.id;
          }

          // Store billing address if available
          if (session.customer_details?.address) {
            order.billingAddress = session.customer_details.address;
          }

          // Store receipt URL if available - with proper null checks
          if (
            session.payment_intent?.charges?.data?.length > 0 &&
            session.payment_intent.charges.data[0].receipt_url
          ) {
            order.receiptUrl = session.payment_intent.charges.data[0].receipt_url;
          }

          await order.save({ transaction: t });
        } catch (stripeError) {
          console.error('Error retrieving Stripe session:', stripeError);
          // Continue with order creation even if Stripe data retrieval fails
          // You can decide whether to throw an error or just log it
        }
      }

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

      // Return order with items and product details
      return await Order.findByPk(order.id, {
        include: [{ model: OrderItem, include: [Product] }],
        transaction: t,
      });
    }
  );
};
