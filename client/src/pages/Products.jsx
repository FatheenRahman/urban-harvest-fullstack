import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Modal & Form State removed as we use Cart now

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        if (!user) {
            alert("Please login to add items to your cart.");
            navigate('/login');
            return;
        }
        addToCart(product);
        alert(`${product.name} added to cart! 🛒`);
    };

    // Purchase handler removed

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-neon-green"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold neon-text-green tracking-widest"
                >
                    PREMIUM MARKET
                </motion.h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Premium zero-gravity products and hydroponic essentials for the modern space colony.
                </p>
            </div>

            <div className="flex justify-center">
                <input
                    type="text"
                    placeholder="SEARCH..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-panel text-neon-green placeholder-gray-600 px-6 py-3 rounded-full w-full max-w-lg focus:outline-none focus:border-neon-green transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product, index) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel rounded-xl overflow-hidden card-hover group"
                    >
                        <div className="h-64 overflow-hidden relative">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">No Visual Data</div>
                            )}
                            <div className="absolute top-0 right-0 bg-black/60 backdrop-blur m-4 px-3 py-1 rounded-full text-xs font-bold border border-neon-green text-neon-green">
                                {product.category.toUpperCase().replace('_', ' ')}
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-white group-hover:text-neon-green transition-colors">{product.name}</h3>
                                <div className="flex items-center text-yellow-400">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 text-sm">5.0</span>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm line-clamp-2 min-h-[2.5rem]">{product.description}</p>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                                <div className="text-2xl font-bold text-neon-blue">
                                    LKR {product.price} <span className="text-xs text-gray-500 font-normal">Per Kg</span>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    <span>ADD TO CART</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">NO MATCHING ORGANIC PRODUCT FOUND</p>
                </div>
            )}
        </div>
    );
};

export default Products;
