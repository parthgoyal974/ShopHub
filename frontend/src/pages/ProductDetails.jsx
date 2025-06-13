import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
// import { CartContext } from "../context/CartContext"; // Uncomment if using context

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { addToCart } = useContext(CartContext); // Uncomment if using context

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [loading, setLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  const [similarError, setSimilarError] = useState("");

  // Fetch main product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}`);
        setProduct(res.data);
        console.log("[DEBUG] Product loaded:", res.data);
      } catch (err) {
        setProduct(null);
        console.error("[DEBUG] Error loading product:", err);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/reviews/product/${id}`);
        setReviews(res.data);
        console.log("[DEBUG] Reviews loaded:", res.data);
      } catch (err) {
        setReviews([]);
        console.error("[DEBUG] Error loading reviews:", err);
      }
    };
    fetchReviews();
  }, [id]);

  // Fetch similar products
  useEffect(() => {
    if (!id) return;
    setSimilarLoading(true);
    setSimilarError("");
    const fetchSimilar = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/products/${id}/similar`);
        setSimilarProducts(res.data);
        console.log("[DEBUG] Similar products loaded:", res.data);
      } catch (err) {
        setSimilarProducts([]);
        setSimilarError("Could not load similar products.");
        console.error("[DEBUG] Error loading similar products:", err);
      }
      setSimilarLoading(false);
    };
    fetchSimilar();
  }, [id]);

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await axios.post(
        `http://localhost:3000/api/reviews/product/${id}`,
        newReview,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setNewReview({ rating: 5, comment: "" });
      // Refresh reviews and product
      const resReview = await axios.get(`http://localhost:3000/api/reviews/product/${id}`);
      setReviews(resReview.data);
      const resProduct = await axios.get(`http://localhost:3000/api/products/${id}`);
      setProduct(resProduct.data);
    } catch (err) {
      navigate("/login");
    }
    setReviewSubmitting(false);
  };

  if (loading)
    return (
      <div className="py-20 text-center text-gray-500 text-xl">Loading...</div>
    );
  if (!product)
    return (
      <div className="py-20 text-center text-red-500 text-xl">
        Product not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8">
          <img
            src={`http://localhost:3000/uploads/${product.image}`}
            alt={product.name}
            className="object-contain rounded-xl w-full h-80 shadow"
            onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
          />
        </div>
        {/* Product Info */}
        <div className="md:w-1/2 p-8 flex flex-col">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 text-xl mr-2">★</span>
            <span className="font-semibold text-lg">{product.rating}</span>
            <span className="ml-3 text-gray-400 text-sm">
              {product.category?.name}
              {product.subcategory ? ` / ${product.subcategory.name}` : ""}
            </span>
          </div>
          <p className="text-gray-700 mb-6">
            {product.description || "No description available."}
          </p>
          <div className="flex items-center space-x-6 mb-6">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow"
              // onClick={() => addToCart(product)} // Uncomment if using context
              onClick={() => alert("Add to cart functionality coming soon!")}
            >
              🛒 Add to Cart
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            <span>
              Availability: <span className="text-green-600">In Stock</span>
            </span>
            {/* Add more product meta info here if needed */}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
        <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
        {reviews.length === 0 ? (
          <div className="text-gray-500 mb-6">No reviews yet.</div>
        ) : (
          <ul className="mb-8">
            {reviews.map((review) => (
              <li key={review.id} className="mb-6 border-b pb-4 last:border-b-0">
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-gray-900">
                    {review.user?.username || "User"}
                  </span>
                  <span className="ml-2 text-yellow-500">
                    ★ {review.rating}
                  </span>
                  <span className="ml-4 text-gray-400 text-xs">
                    {new Date(review.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-gray-700">{review.comment}</div>
              </li>
            ))}
          </ul>
        )}

        {/* Leave a Review */}
        <form
          onSubmit={handleReviewSubmit}
          className="mt-6 p-4 bg-gray-50 rounded-lg shadow-inner"
        >
          <h4 className="font-semibold mb-2">Leave a Review</h4>
          <div className="flex items-center mb-2">
            <label className="mr-2">Rating:</label>
            <select
              value={newReview.rating}
              onChange={e =>
                setNewReview({ ...newReview, rating: Number(e.target.value) })
              }
              className="border rounded px-2 py-1"
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={newReview.comment}
            onChange={e =>
              setNewReview({ ...newReview, comment: e.target.value })
            }
            placeholder="Write your review..."
            className="w-full border rounded px-3 py-2 mb-2"
            rows={3}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={reviewSubmitting}
          >
            {reviewSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Similar Products Section */}
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow p-8">
        <h3 className="text-2xl font-bold mb-6">Similar Products</h3>
        {similarLoading ? (
          <div className="text-gray-500">Loading similar products...</div>
        ) : similarError ? (
          <div className="text-red-500">{similarError}</div>
        ) : similarProducts.length === 0 ? (
          <div className="text-gray-500">No similar products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {similarProducts.map(sp => (
              <Link to={`/products/${sp.id}`} key={sp.id} className="block">
                <div className="bg-gray-50 rounded-xl shadow hover:shadow-lg p-4 flex flex-col items-center">
                  <img
                    src={`http://localhost:3000/uploads/${sp.image}`}
                    alt={sp.name}
                    className="object-cover rounded-lg w-full h-40 mb-2"
                    style={{ maxWidth: 200 }}
                    onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                  />
                  <div className="font-semibold text-lg text-center">{sp.name}</div>
                  <div className="text-blue-600 font-bold">${sp.price}</div>
                  <div className="text-yellow-500">★ {sp.rating}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Back Link */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <Link to="/products" className="text-blue-600 underline">
          ← Back to Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetails;
