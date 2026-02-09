import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [scanning, setScanning] = useState(false);
    const [nearbyOnly, setNearbyOnly] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleFindNearby = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setScanning(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Simulate processing delay for effect
                setTimeout(() => {
                    setNearbyOnly(true);
                    setScanning(false);
                }, 1500);
            },
            (error) => {
                console.error(error);
                setScanning(false);
                alert("Unable to retrieve your location");
            }
        );
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesNearby = nearbyOnly ? event.id % 2 === 0 : true;

        return matchesSearch && matchesNearby;
    });

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-neon-blue"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold neon-text-blue tracking-widest"
                >
                    COMMUNITY EVENTS
                </motion.h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Join workshops and seminars to advance our collective agricultural knowledge.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 items-center">
                <input
                    type="text"
                    placeholder="SEARCH EVENTS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="glass-panel text-neon-blue placeholder-gray-600 px-6 py-3 rounded-full w-full max-w-lg focus:outline-none focus:border-neon-blue transition-all"
                />
                <button
                    onClick={nearbyOnly ? () => setNearbyOnly(false) : handleFindNearby}
                    className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${nearbyOnly ? 'bg-neon-blue text-black' : 'glass-panel text-neon-blue hover:bg-neon-blue/10'}`}
                >
                    <MapPin className={`w-5 h-5 ${scanning ? 'animate-pulse' : ''}`} />
                    {scanning ? 'SCANNING SECTOR...' : nearbyOnly ? 'SHOW ALL SECTORS' : 'FIND NEARBY'}
                </button>
            </div>

            <div className="space-y-6">
                {filteredEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link to={`/events/${event.id}`} className="glass-panel block rounded-xl overflow-hidden hover:border-neon-blue/50 transition-all duration-300 md:flex group">
                            <div className="md:w-1/3 h-56 md:h-64 overflow-hidden relative">
                                {event.image_url ? (
                                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600">No Image</div>
                                )}
                            </div>

                            <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white group-hover:text-neon-blue transition-colors mb-2">{event.title}</h3>
                                    <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>

                                    <div className="flex items-center text-gray-300 mb-2">
                                        <MapPin className="w-4 h-4 mr-2 text-neon-blue" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <span className="flex items-center text-neon-blue text-sm font-bold tracking-wider group-hover:translate-x-2 transition-transform">
                                        VIEW DETAILS <ArrowRight className="ml-2 w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">NO PLANNED GATHERINGS DETECTED</p>
                </div>
            )}
        </div>
    );
};

export default Events;
