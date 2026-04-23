import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { EventList } from '../pages/admin/EventList';
import { CreateEvent } from '../pages/admin/CreateEvent';
import { ProductManager } from '../pages/admin/ProductManager';
import { EventDetail } from '../pages/EventDetail';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    {/* Public / Client routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/event/:event_id" element={<EventDetail />} />
                    <Route path="/event/code/:code" element={<EventDetail />} />

                    {/* Admin / Owner routes */}
                    <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['owner']}><EventList /></ProtectedRoute>} />
                    <Route path="/admin/events/create" element={<ProtectedRoute allowedRoles={['owner']}><CreateEvent /></ProtectedRoute>} />
                    <Route path="/admin/events/:event_id" element={<ProtectedRoute allowedRoles={['owner']}><EventDetail /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['owner']}><ProductManager /></ProtectedRoute>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
