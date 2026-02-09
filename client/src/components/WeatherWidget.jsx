import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_KEY = '5ca738831744ca98fedaec7567c15149';
    const CITY = 'Colombo';

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`);
                setWeather(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Weather fetch error:", err);
                setError("Unable to retrieve atmospheric data.");
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (loading) return <div className="animate-pulse text-neon-blue text-xs tracking-widest">SCANNING ATMOSPHERE...</div>;
    if (error) return <div className="text-red-500 text-xs tracking-widest">{error}</div>;
    if (!weather) return null;

    const { main, weather: conditions, wind } = weather;
    const currentTemp = Math.round(main.temp);
    const description = conditions[0].description;
    const iconCode = conditions[0].icon;

    // Simple icon mapping
    const getWeatherIcon = (code) => {
        if (code.startsWith('01')) return <Sun className="w-8 h-8 text-yellow-400" />;
        if (code.startsWith('09') || code.startsWith('10')) return <CloudRain className="w-8 h-8 text-neon-blue" />;
        return <Cloud className="w-8 h-8 text-gray-400" />;
    };

    return (
        <div className="glass-panel p-4 rounded-lg border border-neon-blue/30 flex items-center justify-between gap-4 max-w-sm">
            <div className="flex items-center gap-4">
                {getWeatherIcon(iconCode)}
                <div>
                    <div className="text-2xl font-bold text-white leading-none">{currentTemp}°C</div>
                    <div className="text-xs text-neon-blue tracking-widest uppercase">{description}</div>
                    <div className="text-[10px] text-gray-500 uppercase mt-1">LOC: {CITY.toUpperCase()}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                    <Wind className="w-3 h-3" />
                    <span>{wind.speed} m/s</span>
                </div>
                <div className="text-gray-500 text-[10px] uppercase mt-1">HUMIDITY: {main.humidity}%</div>
            </div>
        </div>
    );
};

export default WeatherWidget;
