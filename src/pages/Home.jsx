import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';
import { JAVA_BASE_URL } from '../API_GATEWAY/Apis';

const API_BASE = JAVA_BASE_URL + '/api';

export default function Home() {
    const { user, loading: authLoading } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                let url;
                let isPersonalized = false;

                if (user?.id) {
                    // Logged-in → personalized recommendations
                    url = `${API_BASE}/recommendations?userId=${user.id}&limit=8`;
                    isPersonalized = true;
                } else {
                    // Not logged in → default featured products
                    url = `${API_BASE}/products?limit=8&userId=1`;
                }

                const res = await axios.get(url);

                // Handle both response shapes safely
                let productList = [];

                if (Array.isArray(res.data)) {
                    productList = res.data;                    // new /recommendations format
                } else if (res.data?.products) {
                    productList = res.data.products;           // old /products format
                } else if (res.data?.body && Array.isArray(res.data.body)) {
                    productList = res.data.body;               // if wrapped like your test response
                }

                console.log(`Fetched ${productList.length} products (personalized: ${isPersonalized})`);

                setProducts(productList);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Could not load products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [authLoading, user?.id]); // Re-run when user logs in/out

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24 text-center rounded-b-3xl mb-12 shadow-xl">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    {user?.name ? `Welcome back, ${user.name}!` : 'Welcome to Adaptive E-Commerce'}
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-3xl mx-auto">
                    {user?.id
                        ? 'Enjoy exclusive personalized prices & smart recommendations just for you'
                        : 'Discover adaptive pricing, smart recommendations, and exclusive deals'}
                </p>

                <div className="max-w-xl mx-auto mb-10 px-4">
                    <SearchBar />
                </div>

                <Link
                    to="/products"
                    className="inline-block bg-white text-indigo-700 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
                >
                    Start Shopping →
                </Link>
            </div>

            {/* Featured / Recommended Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
                    {user?.id ? 'Recommended for You' : 'Featured Products'}
                </h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
                        <p className="text-xl text-gray-600">
                            {user?.id ? 'Loading your personalized recommendations...' : 'Loading featured products...'}
                        </p>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-xl text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700"
                        >
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-center text-xl text-gray-600 py-16">
                        No products available right now
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            // If your ProductCard expects slightly different prop names:
                            // name={product.name} price={product.suggestedPrice} etc.
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <div className="bg-indigo-50 py-16 text-center rounded-t-3xl mt-12">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Ready to explore more?
                </h3>
                <Link
                    to="/products"
                    className="inline-block bg-indigo-600 text-white px-12 py-5 rounded-full font-bold text-lg hover:bg-indigo-700 transition shadow-md"
                >
                    Browse All Products
                </Link>
            </div>
        </div>
    );
}