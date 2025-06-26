import Order from '../../models/order.js';
import OrderItem from '../../models/orderItem.js';
import Users from '../../models/users.js';
import Product from '../../models/product.js';

// List all orders
export const renderOrderList = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: Users, attributes: ['username', 'email'] },
        { model: OrderItem, include: [Product] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.render('orders', { orders, activePage: 'orders' });
  } catch (err) {
    res.status(500).send('Error loading orders');
  }
};

// View order details
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

// (Optional) Update order status
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

// (Optional) Delete order
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
