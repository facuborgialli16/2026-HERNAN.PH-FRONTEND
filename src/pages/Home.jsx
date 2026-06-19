import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../api/axiosConfig';

export const Home = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const [publicEvents, setPublicEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicEvents = async () => {
            try {
                const response = await apiClient.get('/api/events');
                if (response.data && response.data.ok !== false) {
                    const events = response.data.data.events || [];
                    setPublicEvents(events.filter(e => e.visibility === 'public'));
                }
            } catch (err) {
                console.error('Error al cargar eventos públicos:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicEvents();
    }, []);

    const handleAccess = (e) => {
        e.preventDefault();
        if (code.trim()) {
            navigate(`/event/code/${code.trim()}`);
        }
    };

    return (
        <div className="flex flex-col items-center pt-20 text-center min-h-[60vh] pb-20 px-4">
            <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">
                Bienvenido a HERNAN.PH
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-lg">
                Ingresa tu código de evento para ver las galerías y armar tu pedido de fotos.
            </p>
            <form onSubmit={handleAccess} className="flex flex-col sm:flex-row gap-4 mb-20 w-full max-w-md">
                <input
                    type="text"
                    placeholder="Código del evento"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="flex-1 w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors"
                />
                <button
                    type="submit"
                    className="bg-black text-white px-8 py-3 hover:bg-neutral-800 transition-colors uppercase text-sm tracking-widest font-semibold"
                >
                    Ingresar
                </button>
            </form>

            {/* Sección Eventos Públicos */}
            <div className="w-full max-w-6xl mt-10">
                <h2 className="text-2xl font-light text-left tracking-tight mb-8 border-b border-gray-200 pb-4">
                    Eventos Destacados (Públicos)
                </h2>

                {loading ? (
                    <p className="text-gray-500 text-left">Cargando eventos...</p>
                ) : publicEvents.length === 0 ? (
                    <p className="text-gray-500 text-left bg-gray-50 p-6 border border-gray-100">
                        Por el momento no hay eventos públicos disponibles.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {publicEvents.map((event) => (
                            <Link
                                key={event._id}
                                to={`/event/${event._id}`}
                                className="block border border-gray-200 p-6 hover:shadow-lg transition-shadow bg-white group cursor-pointer"
                            >
                                <h3 className="text-xl font-medium mb-3 group-hover:text-gray-700 transition-colors">{event.name}</h3>
                                <div className="flex justify-between items-center mt-6">
                                    <span className="text-xs text-gray-500 uppercase tracking-widest">{event.type}</span>
                                    <span className="bg-black text-white px-4 py-2 uppercase text-xs tracking-widest font-semibold hover:bg-neutral-800 transition-colors block text-center min-w-[100px]">
                                        Ver Galería
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
