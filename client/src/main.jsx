import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@fontsource/orbitron';
import { CartProvider } from './context/CartContext';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('New content available. Reload?')) {
            updateSW(true);
        }
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CartProvider>
            <App />
        </CartProvider>
    </React.StrictMode>,
)
