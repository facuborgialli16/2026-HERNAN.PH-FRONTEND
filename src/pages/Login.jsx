import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const verified = searchParams.get('verified');

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = await login(formData.email, formData.password);
            if (user.role === 'owner') {
                navigate('/admin/events'); // Redirección temporal para dueño
            } else {
                navigate('/'); // Redirección temporal para cliente
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-20 px-4">
            <div className="w-full max-w-md bg-white p-6 md:p-8 border border-neutral-200">
                <h2 className="text-3xl font-light mb-6 text-center tracking-tight">INICIAR SESIÓN</h2>

                {verified && (
                    <div className="bg-green-50 text-green-700 p-4 mb-6 border border-green-200 text-sm text-center">
                        ¡Email verificado correctamente! Ahora puedes iniciar sesión.
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 mb-6 border border-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            required
                            autoComplete="email"
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
                            autoComplete="current-password"
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
                        {isLoading ? 'Iniciando...' : 'Ingresar'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    ¿No tienes cuenta? <Link to="/register" className="text-black hover:underline">Regístrate</Link>
                </div>
            </div>
        </div>
    );
};
