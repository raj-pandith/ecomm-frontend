import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';

export default function Home() {
    const { user, loading: authLoading } = useAuth();

    const [products, setProducts] = useState([]); // always array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;

        const fetchFeaturedProducts = async () => {
            setLoading(true);
            setError(null);

            try {
                const demoUserId = 1;
                const url = `https://ecomm-backend-production-4a0f.up.railway.app/api/products?userId=${demoUserId}&limit=8`;

                const res = await axios.get(url);

                const data = res.data;
                let productList = [];

                if (Array.isArray(data)) {
                    productList = data;
                } else if (data && Array.isArray(data.products)) {
                    productList = data.products;
                } else if (data && typeof data === 'object') {
                    productList = data.products || data.items || [];
                }

                console.log('Fetched products:', productList);
                setProducts(productList);
            } catch (err) {
                console.error('Failed to fetch featured products:', err);
                setError('Could not load featured products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, [authLoading]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Responsive */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Welcome to Adaptive E-Commerce
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                        Discover personalized prices, smart recommendations, and exclusive promotions
                    </p>
                    <p className="text-base sm:text-lg md:text-xl mb-10 max-w-3xl mx-auto font-medium">
                        Shop smarter – prices adapt to you!
                    </p>

                    <div className="mb-10 max-w-xl mx-auto">
                        <SearchBar />
                    </div>

                    <Link
                        to="/products"
                        className="inline-block bg-white text-indigo-700 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                        Start Shopping →
                    </Link>
                </div>
            </div>

            {/* Featured Products Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
                    Featured Products
                </h2>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-lg sm:text-xl text-gray-600">Loading featured products...</p>
                    </div>
                ) : error ? (
                    <p className="text-center text-lg sm:text-xl text-red-600 py-16">{error}</p>
                ) : products.length === 0 ? (
                    <p className="text-center text-lg sm:text-xl text-gray-600 py-16">
                        No featured products available right now
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {(products || []).map((product, index) => (
                            <div key={product?.id || index} className="transform hover:scale-105 transition duration-300">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                        Ready to shop?
                    </h3>
                    <Link
                        to="/products"
                        className="inline-block bg-indigo-600 text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-base sm:text-lg hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                        Browse All Products
                    </Link>
                </div>
            </div>
        </div>
    );
}