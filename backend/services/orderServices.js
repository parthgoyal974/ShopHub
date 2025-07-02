// services/orderServices.js

import Sequelize from 'sequelize';
import Order from '../models/order.js';
import OrderItem from '../models/orderItem.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';
import CartItem from '../models/cartItem.js';
import sequelize from '../lib/db.js';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import Users from '../models/users.js';
import dotenv from 'dotenv';
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
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
// mailer.js or similar
export const sendBillingEmail = async ({ user, order, orderItems, receiptUrl }) => {
  const itemsList = orderItems.map(item =>
    `<li>${item.product.name} x ${item.quantity} @ ₹${item.price} each = ₹${item.price * item.quantity}</li>`
  ).join('');

  const billingAddress = order.billingAddress
    ? `
      <p><strong>Billing Address:</strong><br>
      ${order.billingAddress.line1 || ''}<br>
      ${order.billingAddress.line2 || ''}<br>
      ${order.billingAddress.city || ''}, ${order.billingAddress.state || ''} ${order.billingAddress.postal_code || ''}<br>
      ${order.billingAddress.country || ''}
      </p>
    `
    : '';

  const html = `
    <h2>Thank you for your order!</h2>
    <p>Order ID: <strong>${order.id}</strong></p>
    <ul>${itemsList}</ul>
    <p><strong>Total Paid:</strong> ₹${order.total}</p>
    ${billingAddress}
    ${receiptUrl ? `<p><a href="${receiptUrl}">View Payment Receipt</a></p>` : ''}
    <p>If you have any questions, reply to this email.</p>
  `;

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Order Confirmation - Order #${order.id}`,
    html
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
const session1 = await stripe.checkout.sessions.retrieve(sessionId, {
  expand: ['payment_intent.charges'],
});
let receiptUrl = null;

const charge = await stripe.charges.retrieve(session1.payment_intent.latest_charge);
order.receiptUrl = charge.receipt_url;



          await order.save({ transaction: t });
        } catch (stripeError) {
          console.error('Error retrieving Stripe session:', stripeError);
          // Continue with order creation even if Stripe data retrieval fails
          // You can decide whether to throw an error or just log it
        }
      }

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

      // Return order with items and product details
      const fullOrder = await Order.findByPk(order.id, {
        include: [{ model: OrderItem, include: [Product] }],
        transaction: t,
      });

      // Fetch user
      const user = await Users.findByPk(userId, { transaction: t });
      console.log("HEYYYYYYY")
      console.log(fullOrder.toJSON());

      // Send billing email
      try {
        await sendBillingEmail({
          user,
          order: fullOrder,
          orderItems: fullOrder.orderItems,
          receiptUrl:order.receiptUrl
        });
      } catch (mailError) {
        console.error('Failed to send billing email:', mailError);
        // Optionally: throw or continue
      }

      return fullOrder;
      });
    }

