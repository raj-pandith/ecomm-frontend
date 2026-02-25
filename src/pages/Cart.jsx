import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
    const cartContext = useCart();
    const { cart = [], removeFromCart, updateQuantity, clearCart } = cartContext || {};

    const navigate = useNavigate();

    // Safe total calculation with fallback
    const total = Array.isArray(cart)
        ? cart.reduce((sum, item) => {
            const price = Number(item?.suggestedPrice ?? item?.originalPrice ?? 0);
            const quantity = Number(item?.quantity) || 1;
            return sum + price * quantity;
        }, 0)
        : 0;

    console.log("Cart context debug:", {
        cartLength: cart.length,
        calculatedTotal: total,
        rawCart: cart,
    });

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800">
                    Your Cart is Empty
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-md">
                    Looks like you haven't added anything yet. Start shopping now!
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-indigo-700 transition transform hover:scale-105 shadow-md"
                >
                    Start Shopping →
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-16 sm:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Your Cart
                    </h1>
                    <div className="text-lg sm:text-xl font-medium text-gray-700">
                        {cart.length} item{cart.length !== 1 ? "s" : ""}
                    </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-6 sm:space-y-8">
                    {cart.map((item, index) => {
                        const price = Number(item?.suggestedPrice ?? item?.originalPrice ?? 0);
                        const quantity = Number(item?.quantity) || 1;
                        const subtotal = price * quantity;

                        return (
                            <div
                                key={item?.id || index}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    {/* Product Image */}
                                    <div className="w-full sm:w-40 h-40 sm:h-auto bg-gray-50 flex-shrink-0">
                                        <img
                                            src={
                                                item?.url ||
                                                item?.image ||
                                                "https://via.placeholder.com/160?text=No+Image"
                                            }
                                            alt={item?.name || "Product"}
                                            className="w-full h-full object-contain p-4"
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/160?text=Image+Error";
                                            }}
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 p-5 sm:p-6 flex flex-col">
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {item?.name || "Unnamed Product"}
                                        </h3>

                                        {/* Price & Discount */}
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <span className="text-xl sm:text-2xl font-bold text-green-600">
                                                ₹{price.toFixed(2)}
                                            </span>

                                            {Number(item?.discountPercent) > 0 && (
                                                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                                                    {Number(item.discountPercent).toFixed(1)}% off
                                                </span>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-4 mb-5">
                                            <button
                                                onClick={() =>
                                                    updateQuantity?.(item?.id, quantity - 1)
                                                }
                                                disabled={quantity <= 1}
                                                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                            >
                                                −
                                            </button>

                                            <span className="text-lg font-medium w-12 text-center">
                                                {quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    updateQuantity?.(item?.id, quantity + 1)
                                                }
                                                className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl hover:bg-gray-300 transition"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Subtotal & Remove */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-auto">
                                            <p className="text-lg font-bold text-gray-900">
                                                Subtotal: ₹{subtotal.toFixed(2)}
                                            </p>

                                            <button
                                                onClick={() => removeFromCart?.(item?.id)}
                                                className="text-red-600 hover:text-red-800 font-medium transition self-start sm:self-auto"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary & Checkout */}
                <div className="mt-10 sm:mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
                        <div className="text-center sm:text-left">
                            <p className="text-lg text-gray-600">Total Items</p>
                            <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                                {cart.length}
                            </p>
                        </div>

                        <div className="text-center sm:text-right">
                            <p className="text-lg text-gray-600">Total Amount</p>
                            <p className="text-3xl sm:text-4xl font-bold text-green-600">
                                ₹{total.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/checkout/address"
                        state={{ amount: total }}
                        className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-5 rounded-xl font-bold text-lg text-center hover:from-green-700 hover:to-green-800 transition transform hover:scale-[1.02] shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300"
                    >
                        Proceed to Checkout →
                    </Link>

                    <button
                        onClick={() => {
                            if (window.confirm("Clear entire cart?")) {
                                clearCart?.();
                            }
                        }}
                        className="mt-4 w-full text-red-600 hover:text-red-700 font-medium text-center transition"
                    >
                        Clear Cart
                    </button>
                </div>
            </div>
        </div>
    );
}