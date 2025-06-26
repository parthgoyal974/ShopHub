import express from 'express';
import {
  renderOrderList,
  renderOrderDetails,
  handleUpdateOrderStatus,
  handleDeleteOrder
} from '../controllers/adminOrderController.js';

const router = express.Router();

router.get('/', renderOrderList);
router.get('/:id', renderOrderDetails);
router.post('/:id/status', handleUpdateOrderStatus); // For updating status
router.post('/delete/:id', handleDeleteOrder);

export default router;
