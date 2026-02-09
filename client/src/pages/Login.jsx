import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-700">LOGIN</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-1xl font-bold mb-6 text-center text-green-700">EMAIL</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-black-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-green-400 text-black placeholder-gray-700 font-bold" required />
                </div>
                <div>
                    <label className="text-1xl font-bold mb-6 text-center text-green-700">PASSWORD</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-black-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-green-400 text-black placeholder-gray-700 font-bold" required />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">LOGIN</button>
            </form>
        </div>
    );
};

export default Login;
