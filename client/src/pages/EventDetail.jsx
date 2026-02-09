import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, MapPin, Tag } from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contactNumber: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleInteract = () => {
        if (!user) {
            alert("Please login to register for events.");
            navigate('/login');
            return;
        }
        // Pre-fill email/name if available from user context, otherwise blank
        setFormData({
            fullName: user.username || '',
            email: user.email || '',
            contactNumber: ''
        });
        setShowModal(true);
        setError('');
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.email || !formData.contactNumber) {
            setError("Invalid input detected. Please correct the inputs and proceed again.");
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Invalid input detected. Please correct the inputs and proceed again.");
            return;
        }

        // Contact number validation (digits only)
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(formData.contactNumber)) {
            setError("Invalid input detected. Please correct the inputs and proceed again.");
            return;
        }

        try {
            await api.post(`/events/${id}/register`, formData);
            alert("Thank you. Your registration is successful. You will be notified once the venue, date, and time are confirmed.");
            setShowModal(false);
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed.");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-neon-blue"></div>
        </div>
    );
    if (!event) return <div className="text-center mt-10 text-xl text-red-500 font-bold">EVENT SIGNAL LOST.</div>;

    return (
        <div className="glass-panel rounded-xl overflow-hidden border border-gray-700">
            <div className="h-64 sm:h-96 w-full relative">
                {event.image_url ?
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" /> :
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 font-mono">NO VISUAL DATA</div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>

            <div className="p-8 relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <h1 className="text-4xl font-bold text-white mb-2 md:mb-0 tracking-wide neon-text-blue">{event.title}</h1>
                    <span className="bg-neon-blue/10 border border-neon-blue text-neon-blue text-xs font-bold px-3 py-1 rounded-full flex items-center uppercase tracking-widest">
                        <Tag className="w-3 h-3 mr-2" />
                        {event.category || 'OPERATION'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

                    <div className="flex items-center text-gray-300 bg-gray-800/50 p-4 rounded-lg">
                        <MapPin className="w-5 h-5 mr-3 text-neon-green" />
                        <span className="font-mono text-lg">{event.location}</span>
                    </div>
                    <WeatherWidget />
                </div>

                <div className="prose prose-invert max-w-none text-gray-400 mb-10 text-lg leading-relaxed">
                    <p>{event.description}</p>
                </div>

                {/* Registration Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="glass-panel w-full max-w-md p-8 rounded-xl relative border border-neon-blue">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-bold mb-6 text-neon-blue text-center">EVENT REGISTRATION</h2>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-neon-blue outline-none"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-neon-blue outline-none"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1">Contact Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-black/50 border border-gray-600 rounded p-2 text-white focus:border-neon-blue outline-none"
                                        value={formData.contactNumber}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full py-3 mt-4 font-bold tracking-wider">
                                    CONFIRM REGISTRATION
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="border-t border-gray-700 pt-6 flex justify-between items-center">
                    <Link to="/events" className="text-gray-400 hover:text-neon-blue font-bold tracking-wider transition-colors flex items-center group">
                        &larr; <span className="ml-2 group-hover:translate-x-1 transition-transform">RETURN TO NEXUS</span>
                    </Link>
                    <button onClick={handleInteract} className="btn-primary">REGISTER ATTENDANCE</button>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;
