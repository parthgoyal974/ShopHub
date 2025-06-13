import { 
  getReviewsForProduct,
  addReviewForProduct
} from '../services/reviewServices.js';

const getReviewsForProductHandler = async (req, res) => {
  try {
    const reviews = await getReviewsForProduct(req.params.productId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addReviewForProductHandler = async (req, res) => {
  try {
    await addReviewForProduct(
      req.params.productId,
      req.userId,
      req.body.rating,
      req.body.comment
    );
    res.status(201).json({ message: "Review added and product rating updated." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  getReviewsForProductHandler,
  addReviewForProductHandler
};
