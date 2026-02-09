import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-deep-space text-white font-sans selection:bg-neon-green selection:text-black flex flex-col">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Ambient Background Glows */}
                <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                <div className="container mx-auto">
                    <Outlet />
                </div>
            </main>
            <footer className="glass-panel py-8 mt-auto border-t border-gray-800">
                <div className="container mx-auto text-center">
                    <p className="text-gray-500 font-mono text-sm">
                        &copy; URBAN HARVEST HUB // Developed By Fatheen
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
