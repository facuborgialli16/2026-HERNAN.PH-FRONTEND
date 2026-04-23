import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const MainLayout = () => {
    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl w-full">
                <Outlet />
            </main>
            <footer className="py-6 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} HERNAN.PH. Todos los derechos reservados.
            </footer>
        </div>
    );
};
