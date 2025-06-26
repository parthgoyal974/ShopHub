import { Op } from "sequelize";
import Product from '../../models/product.js';
import Category from '../../models/category.js';
import Subcategory from '../../models/subCategory.js';
import Order from '../../models/order.js';
import Users from '../../models/users.js';
import Review from '../../models/review.js';
import OrderItem from '../../models/orderItem.js';

// Admin Dashboard Analytics Controller
export const adminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const last30 = new Date();
    last30.setDate(now.getDate() - 30);

    // Total counts
    const productCount = await Product.count();
    const categoryCount = await Category.count();
    const subcategoryCount = await Subcategory.count();
    const orderCount = await Order.count();
    const userCount = await Users.count();

    // Sales analytics
    const totalSales = await Order.sum('total') || 0;
    const salesLast30 = await Order.sum('total', { where: { createdAt: { [Op.gte]: last30 } } }) || 0;

    // Orders analytics
    const ordersLast30 = await Order.count({ where: { createdAt: { [Op.gte]: last30 } } });

    // New users analytics
    const newUsersLast30 = await Users.count({ where: { createdAt: { [Op.gte]: last30 } } });

    // Average order value
    const avgOrderValue = orderCount ? (totalSales / orderCount).toFixed(2) : 0;

    // Order status breakdown
    const completedOrders = await Order.count({ where: { status: 'completed' } });
    const shippedOrders = await Order.count({ where: { status: 'shipped' } });
    const cancelledOrders = await Order.count({ where: { status: 'cancelled' } });

    // Top 5 products by rating (or by sales, if you join with OrderItem)
    const topProducts = await Product.findAll({
      order: [['rating', 'DESC']],
      limit: 5
    });

    // For chart: Orders per day (last 7 days)
    const ordersPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dayStart = new Date(day.setHours(0,0,0,0));
      const dayEnd = new Date(day.setHours(23,59,59,999));
      const count = await Order.count({
        where: {
          createdAt: { [Op.between]: [dayStart, dayEnd] }
        }
      });
      ordersPerDay.push({ date: dayStart.toLocaleDateString(), count });
    }

    res.render('dashboard', {
      stats: {
        productCount,
        categoryCount,
        subcategoryCount,
        orderCount,
        userCount,
        totalSales,
        salesLast30,
        ordersLast30,
        newUsersLast30,
        avgOrderValue,
        completedOrders,
        shippedOrders,
        cancelledOrders,
        ordersPerDay
      },
      topProducts,
      activePage: 'dashboard'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard analytics');
  }
};
