import Stripe from 'stripe';
import { getCartItems } from '../services/cartServices.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  try {
    // 1. Get all cart items for the authenticated user
    const cartItems = await getCartItems(req.userId);
    if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

    // 2. Build line_items for Stripe
    const line_items = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: item.product.image ? [item.product.image] : [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    // 3. Create the Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
  success_url: `${process.env.BASE_URL}/orders?success=true`,
  cancel_url: `${process.env.BASE_URL}/cart`,
      customer_email: req.userEmail,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Stripe session creation failed' });
  }
};
