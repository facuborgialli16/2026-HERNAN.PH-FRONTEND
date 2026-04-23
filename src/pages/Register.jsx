import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const Register = () => {
    const { register } = useAuth();
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            await register(formData.username, formData.email, formData.password);
            setSuccess('Usuario creado correctamente. Revisa tu email para verificar la cuenta.');
            setFormData({ username: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Error al registrar el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-20 px-4">
            <div className="w-full max-w-md bg-white p-6 md:p-8 border border-neutral-200">
                <h2 className="text-3xl font-light mb-6 text-center tracking-tight">REGISTRARSE</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 mb-6 border border-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 text-green-700 p-4 mb-6 border border-green-200 text-sm text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            required
                            placeholder="Nombre completo o Usuario"
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="Correo Electrónico"
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            required
                            placeholder="Contraseña"
                            className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-black transition-colors"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white py-4 hover:bg-neutral-800 transition-colors uppercase text-sm tracking-widest font-semibold disabled:opacity-50"
                    >
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    ¿Ya tienes cuenta? <Link to="/login" className="text-black hover:underline">Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
};
