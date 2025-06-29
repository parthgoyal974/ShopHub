import express from 'express';
import { stripeWebhookHandler } from '../controllers/stripeWebhookController.js';

const router = express.Router();

// Stripe requires the raw body for signature verification
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
