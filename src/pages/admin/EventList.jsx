import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

export const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiClient.get('/api/events');
                // El backend devuelve { data: { events } } dentro de response.data
                setEvents(response.data.data.events || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar los eventos');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este evento permanentemente?")) return;
        try {
            await apiClient.delete(`/api/events/${id}`);
            const response = await apiClient.get('/api/events');
            setEvents(response.data.data.events || []);
        } catch (err) {
            alert("Error al eliminar evento");
        }
    };

    return (
        <div className="py-10 max-w-6xl mx-auto px-4 lg:px-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <h2 className="text-3xl font-light tracking-tight">Mis Eventos</h2>
                <Link
                    to="/admin/events/create"
                    className="bg-black text-white px-6 py-3 uppercase text-xs tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
                >
                    Crear Evento
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 mb-6 border border-red-200 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <p className="text-gray-500">Cargando eventos...</p>
            ) : events.length === 0 ? (
                <p className="text-gray-500">No hay eventos creados todavía.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white border border-gray-200 p-6 flex flex-col hover:shadow-lg transition-shadow">
                            <div className="flex justify-between items-start mb-4 gap-2">
                                <h3 className="text-xl font-medium break-all">{event.name}</h3>
                                <span className={`shrink-0 text-xs px-2 py-1 rounded uppercase tracking-wider ${event.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {event.visibility}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 mb-6 flex-1">
                                <p><span className="font-semibold text-gray-900">Tipo:</span> {event.type}</p>
                                {event.visibility === 'private' && event.code && <p><span className="font-semibold text-gray-900">Código:</span> {event.code}</p>}
                                {event.date && <p><span className="font-semibold text-gray-900">Fecha:</span> {new Date(event.date).toLocaleDateString()}</p>}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                                <Link
                                    to={`/admin/events/${event._id}`}
                                    className="flex-1 text-center border border-black text-black px-4 py-2 uppercase text-xs tracking-widest font-semibold hover:bg-black hover:text-white transition-colors"
                                >
                                    Ver Detalles
                                </Link>
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="px-4 py-2 text-center uppercase text-xs tracking-widest font-semibold text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
