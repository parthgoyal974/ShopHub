// routes/stripeRoutes.js

import express from 'express';
import { createStripeSession } from '../controllers/stripeControllers.js';
import { verifyTokenMiddleware } from '../services/authServices.js';

const router = express.Router();

router.post('/create-session', verifyTokenMiddleware, createStripeSession);

export default router;
