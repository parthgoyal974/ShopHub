// /admin/controllers/adminDashboardController.js
import Product from '../../models/product.js';
import Category from '../../models/category.js';
import Subcategory from '../../models/subCategory.js';
import Order from '../../models/order.js';
import Users from '../../models/users.js';

export const adminDashboard = async (req, res) => {
  try {
    // Fetch dashboard stats (reuse your models)
    const [productCount, categoryCount, subcategoryCount, orderCount, userCount] = await Promise.all([
      Product.count(),
      Category.count(),
      Subcategory.count(),
      Order.count(),
      Users.count()
    ]);

    res.render('dashboard', {
      stats: {
        productCount,
        categoryCount,
        subcategoryCount,
        orderCount,
        userCount
      }
    });
  } catch (err) {
    console.log(err)
    res.status(500).send('error loading dashboard');
  }
};
