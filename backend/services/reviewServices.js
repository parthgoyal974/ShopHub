import Review from '../models/review.js';
import User from '../models/users.js';
import Product from '../models/product.js';

// Get all reviews for a product
export const getReviewsForProduct = async (productId) => {
  return await Review.findAll({
    where: { productId },
    include: [{ model: User, attributes: ['username'] }],
    order: [['createdAt', 'DESC']]
  });
};

// Add a review and update product rating
export const addReviewForProduct = async (productId, userId, rating, comment) => {
  // 1. Create the review
  await Review.create({
    productId,
    userId,
    rating,
    comment
  });

  // 2. Recalculate average rating for this product
  const result = await Review.findAll({
    where: { productId },
    attributes: [
      [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'avgRating']
    ],
    raw: true
  });

  const avgRating = parseFloat(result[0].avgRating) || 0;

  // 3. Update the product's rating column
  await Product.update(
    { rating: avgRating },
    { where: { id: productId } }
  );
};
