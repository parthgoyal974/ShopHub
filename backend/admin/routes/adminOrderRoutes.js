import express from 'express';
import {
  renderOrderUsersList,      // GET /admin/orders/users
  renderUserOrdersList,      // GET /admin/orders/users/:userId
  renderOrderDetails,        // GET /admin/orders/:id
  handleUpdateOrderStatus,   // POST /admin/orders/:id/status
  handleDeleteOrder          // POST /admin/orders/delete/:id
} from '../controllers/adminOrderController.js';

const router = express.Router();

// 1. Paginated list of users who have placed at least one order
router.get('/', renderOrderUsersList);

// 2. Paginated list of orders for a selected user
router.get('/users/:userId', renderUserOrdersList);

// 3. View order details
router.get('/:id', renderOrderDetails);

// 4. Update order status (form POST)
router.post('/:id/status', handleUpdateOrderStatus);

// 5. Delete order (form POST)
router.post('/delete/:id', handleDeleteOrder);

export default router;
