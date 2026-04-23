import { useState } from 'react';
import { apiClient } from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        type: 'wedding',
        visibility: 'private',
        date: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await apiClient.post('/events', formData);
            navigate('/admin/events');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear el evento');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4 md:px-0">
            <h2 className="text-3xl font-light tracking-tight mb-8">Crear Nuevo Evento</h2>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 mb-6 border border-red-200 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 border border-neutral-200 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Evento</label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
                        <select
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors bg-white whitespace-pre"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="school">Escolar (School)</option>
                            <option value="birthday">Cumpleaños (Birthday)</option>
                            <option value="wedding">Boda (Wedding)</option>
                            <option value="sport">Deporte (Sport)</option>
                            <option value="other">Otro (Other)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visibilidad</label>
                        <select
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors bg-white whitespace-pre"
                            value={formData.visibility}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                        >
                            <option value="private">Privado</option>
                            <option value="public">Público</option>
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-end gap-4 w-full">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/events')}
                        className="w-full sm:w-auto border border-black text-black px-8 py-3 hover:bg-neutral-100 transition-colors uppercase text-sm tracking-widest font-semibold"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-black text-white px-8 py-3 hover:bg-neutral-800 transition-colors uppercase text-sm tracking-widest font-semibold disabled:opacity-50"
                    >
                        {isLoading ? 'Guardando...' : 'Crear Evento'}
                    </button>
                </div>
            </form>
        </div>
    );
};
