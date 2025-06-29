// controllers/stripeWebhookController.js
import Stripe from 'stripe';
import { placeOrderForUser } from '../services/orderServices.js';
import Users from '../models/users.js';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody, // Make sure to use the raw body, not parsed JSON
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userEmail = session.customer_details?.email; // This is the email entered at checkout[11][13].
    const userId = session.metadata.userId

    // Place the order in your database
    try {
      const order = await placeOrderForUser(userId);

      // Fetch user info
      const user = await Users.findByPk(userId);

      // Prepare billing info (customize as needed)
      const billingInfo = `
Order ID: ${order.id}
Total: $${order.total}
Status: ${order.status}
Ordered Items:
${order.orderItems.map(item => `- ${item.product.name} x${item.quantity} ($${item.price})`).join('\n')}
      `;

      // Send email to the user
      await transporter.sendMail({
        from: `"Your Store" <${process.env.EMAIL_USER}>`,
        to: userEmail || user.email,
        subject: 'Your Order Billing Information',
        text: billingInfo
      });

      res.status(200).json({ received: true });
    } catch (err) {
      console.error('Order placement or email failed:', err);
      res.status(500).json({ error: 'Order or email failed' });
    }
  } else {
    res.status(200).json({ received: true });
  }
};
