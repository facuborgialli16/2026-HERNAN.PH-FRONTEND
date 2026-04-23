import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
        navigate('/');
    };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="bg-neutral-900 text-white p-4 shadow-md relative z-50">
            <div className="container mx-auto flex justify-between items-center max-w-6xl">
                <Link to="/" onClick={closeMenu} className="text-2xl font-bold tracking-wider">HERNAN.<span className="text-gray-400">PH</span></Link>

                {/* Mobile Hamburger Icon */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-gray-300 focus:outline-none p-2"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                    </svg>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 text-sm font-medium items-center">
                    {user ? (
                        <>
                            <span className="text-gray-400">Hola, {user.username}</span>
                            {user.role === 'owner' && (
                                <>
                                    <Link to="/admin/events" className="hover:text-gray-300 transition-colors">Mis Eventos</Link>
                                    <Link to="/admin/products" className="hover:text-gray-300 transition-colors">Productos</Link>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="hover:text-gray-300 transition-colors uppercase text-xs tracking-widest font-semibold"
                            >
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300 transition-colors">Iniciar Sesión</Link>
                            <Link to="/register" className="bg-white text-black px-4 py-2 hover:bg-gray-200 transition-colors uppercase text-xs tracking-widest font-semibold">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            <div className={`md:hidden absolute w-full left-0 top-full bg-neutral-900 border-t border-neutral-800 transition-all duration-300 ${isMenuOpen ? 'max-h-96 opacity-100 py-4 shadow-xl' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <div className="flex flex-col px-6 space-y-4 text-sm font-medium">
                    {user ? (
                        <>
                            <span className="text-gray-400 border-b border-neutral-800 pb-2">Hola, {user.username}</span>
                            {user.role === 'owner' && (
                                <>
                                    <Link to="/admin/events" onClick={closeMenu} className="hover:text-gray-300 block py-1">Mis Eventos</Link>
                                    <Link to="/admin/products" onClick={closeMenu} className="hover:text-gray-300 block py-1">Productos</Link>
                                </>
                            )}
                            <button
                                onClick={handleLogout}
                                className="text-left text-red-400 hover:text-red-300 uppercase text-xs tracking-widest font-semibold pt-2"
                            >
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu} className="hover:text-gray-300 block py-1">Iniciar Sesión</Link>
                            <Link to="/register" onClick={closeMenu} className="bg-white text-black text-center px-4 py-2 mt-2 uppercase text-xs tracking-widest font-semibold">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
