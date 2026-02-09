import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetail from './pages/EventDetail';
import Products from './pages/Products';
import Events from './pages/Events';
import Cart from './pages/Cart';

import { useEffect } from 'react';

function App() {
    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                }
            });
        }
    }, []);

    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="products" element={<Products />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="events" element={<Events />} />
                        <Route path="events/:id" element={<EventDetail />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
