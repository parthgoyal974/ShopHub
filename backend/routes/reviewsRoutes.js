import express from 'express';
import { 
  getReviewsForProductHandler,
  addReviewForProductHandler
} from '../controllers/reviewControllers.js';
import { verifyTokenMiddleware } from '../services/authServices.js';

const router = express.Router();

router.get('/product/:productId', getReviewsForProductHandler);
router.post('/product/:productId', verifyTokenMiddleware, addReviewForProductHandler);

export default router;
