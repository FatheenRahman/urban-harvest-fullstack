import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Menu, X, ShoppingBag, Radio, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const [isOpen, setIsOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Enforce Dark Mode
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };


    const isActive = (path) => location.pathname === path;

    const navLinkClass = (path) => `
        px-3 py-2 rounded-md transition-all duration-300 font-bold tracking-wider relative
        ${isActive(path) ? 'text-neon-green' : 'text-gray-300 hover:text-white'}
    `;

    return (
        <nav className="fixed w-full z-50 glass-panel border-b-0 border-neon-green/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Mobile: Hamburger Menu (Left) */}
                    <div className="flex md:hidden z-50">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-neon-green hover:text-white p-2">
                            {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                        </button>
                    </div>

                    {/* Left Section: Logo (Desktop: Left, Mobile: Center) */}
                    <div className="flex-1 flex justify-center md:justify-start">
                        <Link to="/" className="text-2xl font-bold flex items-center gap-3 neon-text-green">
                            <Radio className="h-8 w-8 animate-pulse hidden md:block" />
                            <span className="tracking-widest text-xl md:text-2xl">URBAN<span className="text-white">HARVEST</span></span>
                        </Link>
                    </div>

                    {/* Center Section: Navigation Links (Walking the middle line) */}
                    <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
                        <Link to="/" className={navLinkClass('/')}>HOME</Link>
                        <Link to="/events" className={navLinkClass('/events')}>EVENTS</Link>
                        <Link to="/products" className={navLinkClass('/products')}>PRODUCTS</Link>
                    </div>

                    {/* Right Section: Actions (Login/User, Install, Cart) */}
                    <div className="hidden md:flex flex-1 justify-end items-center gap-6">

                        {/* 1. Auth Links */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-neon-blue font-mono text-sm border border-neon-blue/30 px-3 py-1 rounded hidden lg:block">
                                    {user.username.toUpperCase()}
                                </span>
                                <button onClick={logout} className="text-red-400 hover:text-red-500 font-bold tracking-wider uppercase text-sm hover:bg-red-500/10 transition">
                                    SIGN OUT
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-300 hover:text-white font-bold tracking-wider uppercase text-sm">LOGIN</Link>
                                <Link to="/register" className="btn-primary text-xs px-4 py-2 border-2">
                                    REGISTER
                                </Link>
                            </div>
                        )}

                        {/* 2. Install App Icon */}
                        {deferredPrompt && (
                            <button
                                onClick={handleInstallClick}
                                className="text-neon-green hover:text-white transition-colors p-1"
                                title="Install App"
                            >
                                <Download className="h-6 w-6" />
                            </button>
                        )}

                        {/* 3. Cart Icon */}
                        <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors p-1">
                            <ShoppingBag className="h-6 w-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-2 bg-neon-green text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Right: Cart Icon (Visible on Mobile for easier access) */}
                    <div className="flex md:hidden z-50">
                        <Link to="/cart" className="relative text-gray-300 hover:text-white transition-colors p-2">
                            <ShoppingBag className="h-6 w-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-neon-green text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                    </div>

                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass-panel border-t border-gray-700 absolute w-full bg-black/95 backdrop-blur-xl"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2 text-center">
                            <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-neon-green py-3 text-xl tracking-widest border-b border-gray-800">HOME</Link>
                            <Link to="/events" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-neon-green py-3 text-xl tracking-widest border-b border-gray-800">EVENTS</Link>
                            <Link to="/products" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-neon-green py-3 text-xl tracking-widest border-b border-gray-800">PRODUCTS</Link>

                            {/* Mobile Install Button */}
                            {deferredPrompt && (
                                <button onClick={() => { handleInstallClick(); setIsOpen(false); }} className="w-full text-neon-green hover:text-white py-3 flex items-center justify-center gap-2 border-b border-gray-800">
                                    <Download className="h-5 w-5" /> INSTALL APP
                                </button>
                            )}

                            {user ? (
                                <div className="pt-4">
                                    <div className="text-neon-blue font-mono mb-4">USER: {user.username}</div>
                                    <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-red-400 py-3 uppercase tracking-widest border border-red-900/50 rounded hover:bg-red-900/20">SIGN OUT</button>
                                </div>
                            ) : (
                                <div className="pt-4 flex flex-col gap-3">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block text-gray-300 py-3 uppercase tracking-widest">LOGIN</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="block btn-primary text-center py-3">REGISTER</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
