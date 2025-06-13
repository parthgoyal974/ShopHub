import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products based on search term
  useEffect(() => {
    let cancelToken;
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        let url = "http://localhost:3000/api/products";
        if (searchTerm.trim() !== "") {
          url = `http://localhost:3000/api/products/search?query=${encodeURIComponent(searchTerm)}`;
        }
        cancelToken = axios.CancelToken.source();



        const res = await axios.get(url, { cancelToken: cancelToken.token });



        setProducts(res.data);

      } catch (err) {
        if (!axios.isCancel(err)) {
          setError("Failed to fetch products.");
          setProducts([]);
        }
      }
      setLoading(false);
    };

    // Debounce: wait 300ms after user stops typing
    const timeout = setTimeout(fetchProducts, 300);
    return () => {
      clearTimeout(timeout);
      if (cancelToken) cancelToken.cancel();
    };
  }, [searchTerm]);

  // Debug: Log products array on each render
  useEffect(() => {
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Products</h2>
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-12 text-xl">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12 text-xl">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-xl">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <Link to={`/products/${product.id}`} key={product.id} className="block">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
                  <div className="relative w-full aspect-w-4 aspect-h-3 bg-gray-100">
                    <img
                      src={`http://localhost:3000/uploads/${product.image}`}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
                      style={{ aspectRatio: '4/3', backgroundColor: '#f3f4f6' }}
                    />
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full px-3 py-1 text-xs font-semibold text-yellow-600 flex items-center shadow">
                      <span className="mr-1">★</span>{product.rating}
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col p-5">
                    <h4 className="font-semibold text-lg text-gray-900 mb-1 truncate">{product.name}</h4>
                    <p className="text-sm text-gray-500 mb-4 truncate">
                      {product.subcategory ? product.subcategory.name : (product.category ? product.category.name : "")}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        ${product.price}
                      </span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
