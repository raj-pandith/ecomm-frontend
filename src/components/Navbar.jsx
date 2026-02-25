import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { totalItems } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Better admin check: use user.role if available (recommended)
    // Fallback to localStorage only if role is not in user object yet
    const isAdmin = user?.role === 'ADMIN' || localStorage.getItem('isAdmin') === 'true';

    const handleLogout = () => {
        logout();
        localStorage.removeItem('isAdmin'); // clean up if used
        navigate('/login');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-indigo-600">
                        AI Shop
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/products" className="text-gray-700 hover:text-indigo-600 transition-colors">
                            Products
                        </Link>

                        {user && (
                            <Link to="/orders" className="text-gray-700 hover:text-indigo-600 transition-colors">
                                Order History
                            </Link>
                        )}

                        {/* Cart with badge */}
                        <Link to="/cart" className="relative flex items-center text-gray-700 hover:text-indigo-600 transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                            <span className="ml-2 hidden sm:inline">Cart</span>
                        </Link>

                        {/* Admin Add Product (only visible to admins) */}
                        {isAdmin && (
                            <Link
                                to="/admin/add-product"
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                            >
                                + Add Product
                            </Link>
                        )}

                        {/* Auth Section */}
                        {user ? (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700 font-medium hidden sm:inline">
                                        Hi, {user.username || 'User'} • {user.loyaltyPoints ?? 0} pts
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <LogOut className="w-5 h-5 mr-1" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    <LogIn className="w-5 h-5 mr-1" />
                                    <span className="hidden sm:inline">Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden text-gray-700 focus:outline-none"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-8 h-8" />
                        ) : (
                            <Menu className="w-8 h-8" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <div className="px-4 py-6 space-y-6">
                        <Link
                            to="/products"
                            className="block text-gray-700 hover:text-indigo-600 text-lg font-medium"
                            onClick={toggleMobileMenu}
                        >
                            Products
                        </Link>

                        {user && (
                            <Link
                                to="/orders"
                                className="block text-gray-700 hover:text-indigo-600 text-lg font-medium"
                                onClick={toggleMobileMenu}
                            >
                                Order History
                            </Link>
                        )}

                        <Link
                            to="/cart"
                            className="flex items-center text-gray-700 hover:text-indigo-600 text-lg font-medium"
                            onClick={toggleMobileMenu}
                        >
                            <ShoppingCart className="w-6 h-6 mr-3" />
                            Cart
                            {totalItems > 0 && (
                                <span className="ml-2 bg-red-500 text-white text-sm rounded-full px-2 py-1">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {isAdmin && (
                            <Link
                                to="/admin/add-product"
                                className="block bg-purple-600 text-white px-6 py-3 rounded-lg text-center font-medium hover:bg-purple-700 transition"
                                onClick={toggleMobileMenu}
                            >
                                + Add Product
                            </Link>
                        )}

                        {/* Auth Section - Mobile */}
                        {user ? (
                            <div className="space-y-4 pt-4 border-t">
                                <div className="flex items-center gap-3">
                                    <User className="w-6 h-6 text-gray-600" />
                                    <span className="text-gray-800 font-medium">
                                        Hi, {user.username || 'User'} • {user.loyaltyPoints ?? 0} pts
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMobileMenu();
                                    }}
                                    className="flex items-center text-red-600 hover:text-red-700 text-lg font-medium w-full"
                                >
                                    <LogOut className="w-6 h-6 mr-3" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 pt-4 border-t">
                                <Link
                                    to="/login"
                                    className="flex items-center text-indigo-600 hover:text-indigo-700 text-lg font-medium"
                                    onClick={toggleMobileMenu}
                                >
                                    <LogIn className="w-6 h-6 mr-3" />
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block bg-indigo-600 text-white px-6 py-3 rounded-lg text-center font-medium hover:bg-indigo-700 transition"
                                    onClick={toggleMobileMenu}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}