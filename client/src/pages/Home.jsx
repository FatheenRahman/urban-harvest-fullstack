import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Zap, Shield } from 'lucide-react';

const Home = () => {
    return (
        <div className="relative">
            {/* Hero Section */}
            <section className="text-center py-20 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter flex flex-col md:block items-center justify-center gap-2 md:gap-0">
                        <span className="text-white">URBAN</span>
                        <span className="text-neon-green">HARVEST</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light tracking-wide">
                        SUSTAINABLE HYDROPONICS // ZERO GRAVITY CULTIVATION
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <Link to="/products" className="btn-primary flex items-center justify-center gap-3 text-lg px-8 py-4 group">
                            PURCHASE PRODUCTS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/events" className="flex items-center justify-center gap-3 px-8 py-4 border border-neon-blue text-neon-blue font-bold tracking-wider hover:bg-neon-blue hover:text-black transition-all duration-300 group">
                            JOIN EVENTS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Features Grid */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
                {[
                    { icon: Globe, title: "GLOBAL NETWORK", desc: "Connected vertical farms across 12 mega-cities.", color: "text-neon-blue" },
                    { icon: Zap, title: "HYPER-EFFICIENT", desc: "95% less water usage via aeroponic misting systems.", color: "text-neon-green" },
                    { icon: Shield, title: "BIO-SECURE", desc: "Contaminant-free growth in sealed atmospheric vaults.", color: "text-neon-purple" }
                ].map((feature, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -10 }}
                        className="glass-panel p-8 rounded-xl border-t border-gray-700 hover:border-white/20 transition-colors"
                    >
                        <feature.icon className={`w-12 h-12 mb-6 ${feature.color}`} />
                        <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* Stat Bar */}
            <div className="border-y border-gray-800 bg-black/30 backdrop-blur py-8 mt-12">
                <div className="flex flex-wrap justify-around text-center gap-8">
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">24/7</div>
                        <div className="text-neon-green text-xs tracking-widest">OPERATIONAL STATUS</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">100%</div>
                        <div className="text-neon-blue text-xs tracking-widest">ORGANIC PURITY</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-white mb-2">ZERO</div>
                        <div className="text-neon-purple text-xs tracking-widest">CARBON FOOTPRINT</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
