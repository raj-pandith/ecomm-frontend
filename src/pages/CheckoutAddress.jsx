import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CheckoutAddress() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const amount = location.state?.amount || 0;

    const [formData, setFormData] = useState({
        fullName: user?.username || '',
        phone: '',
        pincode: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        landmark: '',
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(formData.phone))
            newErrors.phone = "Enter a valid 10-digit phone number";

        if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(formData.pincode))
            newErrors.pincode = "Enter a valid 6-digit pincode";

        if (!formData.addressLine1.trim())
            newErrors.addressLine1 = "Address line 1 is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Save address for checkout session
        localStorage.setItem("deliveryAddress", JSON.stringify(formData));

        // Proceed to payment
        navigate("/checkout/payment", {
            state: { amount },
        });

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        Delivery Address
                    </h1>
                    <p className="mt-3 text-base sm:text-lg text-gray-600">
                        Please provide your delivery details
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 space-y-6"
                >
                    {/* Full Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border ${errors.fullName ? "border-red-500" : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                                placeholder="Enter your full name"
                            />
                            {errors.fullName && (
                                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border ${errors.phone ? "border-red-500" : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                                placeholder="10-digit mobile number"
                                maxLength={10}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Pincode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.pincode ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                            placeholder="6-digit pincode"
                            maxLength={6}
                        />
                        {errors.pincode && (
                            <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                        )}
                    </div>

                    {/* Address Line 1 & 2 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Flat / House No., Building Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${errors.addressLine1 ? "border-red-500" : "border-gray-300"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                            placeholder="House no., building name, apartment"
                        />
                        {errors.addressLine1 && (
                            <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area, Street, Village (optional)
                        </label>
                        <input
                            name="addressLine2"
                            value={formData.addressLine2}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="Street name, area, landmark (optional)"
                        />
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City / District <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border ${errors.city ? "border-red-500" : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                                placeholder="Your city or district"
                            />
                            {errors.city && (
                                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border ${errors.state ? "border-red-500" : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition`}
                                placeholder="Your state"
                            />
                            {errors.state && (
                                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                            )}
                        </div>
                    </div>

                    {/* Landmark */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark (optional)
                        </label>
                        <input
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            placeholder="Nearby landmark (e.g. school, hospital)"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full mt-8 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isSubmitting
                            ? "bg-indigo-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Processing...
                            </>
                        ) : (
                            "Save Address & Proceed to Payment"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}