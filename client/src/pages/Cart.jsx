import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.username || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        if (!user) {
            alert("Please login to checkout.");
            navigate('/login');
            return;
        }

        // Validation
        if (!formData.fullName || !formData.email || !formData.contactNumber || !formData.address) {
            setError("All fields are required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Invalid email format.");
            return;
        }

        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(formData.contactNumber)) {
            setError("Contact number must contain only digits.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/orders', {
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                })),
                fullName: formData.fullName,
                email: formData.email,
                contactNumber: formData.contactNumber,
                address: formData.address
            });

            clearCart();
            alert("Order placed successfully! Your order will be delivered within 48 hours.");
            navigate('/products');
        } catch (err) {
            setError(err.response?.data?.error || "Checkout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
                <div className="text-gray-500 text-6xl">🛒</div>
                <h2 className="text-2xl font-bold text-gray-400">YOUR CART IS EMPTY</h2>
                <button onClick={() => navigate('/products')} className="btn-primary mt-4">
                    BROWSE PRODUCTS
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold neon-text-green tracking-widest text-center mb-8">SHOPPING CART</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cart Items */}
                <div className="space-y-4">
                    {cart.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel p-4 rounded-lg flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-4">
                                {item.image_url && <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded border border-gray-700" />}
                                <div>
                                    <h3 className="font-bold text-white">{item.name}</h3>
                                    <p className="text-neon-blue text-sm">LKR {item.price} <span className="text-xs text-gray-400">Per Kg</span></p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 bg-black/40 rounded px-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="text-gray-400 hover:text-white p-1"
                                    >-</button>
                                    <span className="text-white w-4 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="text-gray-400 hover:text-white p-1"
                                    >+</button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    <div className="glass-panel p-4 rounded-lg flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-gray-300">TOTAL</span>
                        <span className="text-2xl font-bold text-neon-green">LKR {getCartTotal().toFixed(2)}</span>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="glass-panel p-6 rounded-xl border border-neon-green/30 h-fit">
                    <h2 className="text-xl font-bold text-neon-green mb-6 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" /> CHECKOUT DETAILS
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleCheckout} className="space-y-4">
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-neon-green outline-none"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-neon-green outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Contact Number</label>
                            <input
                                type="text"
                                className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-neon-green outline-none"
                                value={formData.contactNumber}
                                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm mb-1">Shipping Address</label>
                            <textarea
                                className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-neon-green outline-none h-24"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="bg-neon-green/10 border border-neon-green/30 p-3 rounded text-sm text-neon-green flex items-start gap-2">
                            <span className="mt-0.5">ℹ️</span>
                            <p>Please note that <strong>Cash on Delivery</strong> is the only payment option available.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 mt-4 font-bold tracking-wider btn-primary ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'PROCESSING...' : 'PLACE ORDER'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Cart;
