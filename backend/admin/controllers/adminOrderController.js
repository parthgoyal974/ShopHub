// /admin/controllers/adminOrderController.js

import Order from '../../models/order.js';
import OrderItem from '../../models/orderItem.js';
import Users from '../../models/users.js';
import Product from '../../models/product.js';
import { Op, fn, col } from 'sequelize';

// 1. List users who have at least one order (paginated)
export const renderOrderUsersList = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Find users with at least one order
  const { count, rows: users } = await Users.findAndCountAll({
    include: [{
      model: Order,
      required: true,
      attributes: []
    }],
    attributes: [
      'id', 'username', 'email',
      [fn('COUNT', col('orders.id')), 'orderCount']
    ],
    group: ['users.id'],
    order: [['id', 'ASC']],
    limit,
    offset,
    subQuery: false
  });

  const totalPages = Math.ceil((Array.isArray(count) ? count.length : count) / limit);

  res.render('orderUsers', {
    users,
    pagination: { page, totalPages },
    activePage: 'orders'
  });
};

// 2. List orders for a specific user (paginated)
export const renderUserOrdersList = async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  const { count, rows: orders } = await Order.findAndCountAll({
    where: { userId },
    include: [
      { model: OrderItem, include: [Product] }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });

  const user = await Users.findByPk(userId);
  const totalPages = Math.ceil(count / limit);

  res.render('userOrders', {
    user,
    orders,
    pagination: { page, totalPages },
    activePage: 'orders'
  });
};

// 3. View order details
export const renderOrderDetails = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Users, attributes: ['username', 'email'] },
        { model: OrderItem, include: [Product] }
      ]
    });
    if (!order) return res.status(404).send('Order not found');
    res.render('orderDetails', { order, activePage: 'orders' });
  } catch (err) {
    res.status(500).send('Error loading order details');
  }
};

// 4. Update order status
export const handleUpdateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).send('Order not found');
    order.status = req.body.status;
    await order.save();
    res.redirect('/admin/orders/' + order.id);
  } catch (err) {
    res.status(500).send('Failed to update order status');
  }
};

// 5. Delete order
export const handleDeleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).send('Order not found');
    await order.destroy();
    res.redirect('/admin/orders');
  } catch (err) {
    res.status(500).send('Failed to delete order');
  }
};
