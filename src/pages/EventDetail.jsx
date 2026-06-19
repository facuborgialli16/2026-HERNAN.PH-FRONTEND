import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export const EventDetail = () => {
    const { event_id, code } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isOwner = user?.role === 'owner';

    const [event, setEvent] = useState(null);
    const [galleries, setGalleries] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Formularios
    const [newGallery, setNewGallery] = useState({ name: '', pdfUrl: '' });
    const [isCreatingGallery, setIsCreatingGallery] = useState(false);

    // Carrito para clientes
    const [cartItem, setCartItem] = useState({ photoNumber: '', productId: '', quantity: 1 });
    const [cart, setCart] = useState([]);
    const [clientName, setClientName] = useState('');
    const [isOrdering, setIsOrdering] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Tabs Owner
    const [activeTab, setActiveTab] = useState('galleries');

    const loadData = async () => {
        try {
            const url = code ? `/api/events/code/${code}` : `/api/events/${event_id}`;
            const eventRes = await apiClient.get(url);

            // Chequear explícitamente si el backend devolvió ok: false
            if (eventRes.data && eventRes.data.ok === false) {
                throw new Error(eventRes.data.message || 'Error en el backend al buscar el evento');
            }

            const evt = eventRes.data.data.event;
            setEvent(evt);

            const actualId = event_id || evt._id;

            const galleriesRes = await apiClient.get(`/api/events/${actualId}/galleries`);
            if (galleriesRes.data && galleriesRes.data.ok !== false) {
                setGalleries(galleriesRes.data.data.galleries || []);
            }

            if (!isOwner) {
                const prodRes = await apiClient.get('/api/products');
                if (prodRes.data && prodRes.data.ok !== false) {
                    setProducts(prodRes.data.data.products || []);
                }
            } else {
                const ordRes = await apiClient.get(`/api/orders/event/${actualId}`);
                if (ordRes.data && ordRes.data.ok !== false) {
                    setOrders(ordRes.data.data.orders || []);
                }
            }

        } catch (err) {
            setError(err.message || err.response?.data?.message || 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [event_id, code, isOwner]);

    const handleDeleteGallery = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta galería?")) return;
        try {
            await apiClient.delete(`/api/galleries/${id}`);
            await loadData();
        } catch (err) {
            alert("Error al eliminar la galería");
        }
    };

    const handleCreateGallery = async (e) => {
        e.preventDefault();
        setIsCreatingGallery(true);
        try {
            await apiClient.post(`/api/events/${event._id}/galleries`, newGallery);
            setNewGallery({ name: '', pdfUrl: '' });
            await loadData();
        } catch (err) {
            alert('Error: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsCreatingGallery(false);
        }
    };

    const addToCart = (e) => {
        e.preventDefault();
        const product = products.find(p => p._id === cartItem.productId);
        if (!product) return;
        setCart([...cart, { ...cartItem, price: product.price, productName: product.name, quantity: Number(cartItem.quantity), photoNumber: Number(cartItem.photoNumber) }]);
        setCartItem({ photoNumber: '', productId: '', quantity: 1 });
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert('El carrito está vacío');
        setIsOrdering(true);
        try {
            await apiClient.post(`/api/events/${event._id}/orders`, {
                clientName,
                items: cart.map(i => ({
                    photoNumber: i.photoNumber,
                    productId: i.productId,
                    quantity: i.quantity,
                    price: i.price
                }))
            });
            setOrderSuccess(true);
            setCart([]);
            setClientName('');
        } catch (err) {
            alert('Error al crear orden: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsOrdering(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Cargando...</div>;
    if (error || !event) return <div className="text-center py-20 text-red-600">{error || 'Evento no encontrado'}</div>;

    return (
        <div className="py-10 max-w-6xl mx-auto px-4 xl:px-0">
            <div className="border-b border-gray-200 pb-8 mb-8">
                <h1 className="text-4xl font-light tracking-tight mb-2 break-words">{event.name}</h1>
                <p className="text-gray-500 uppercase text-sm tracking-widest">
                    {event.type} &bull; {new Date(event.date).toLocaleDateString()}
                </p>
            </div>

            {isOwner && (
                <div className="flex gap-4 mb-8">
                    <button onClick={() => setActiveTab('galleries')} className={`px-6 py-2 uppercase tracking-wider text-xs font-semibold ${activeTab === 'galleries' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>Galerías</button>
                    <button onClick={() => setActiveTab('orders')} className={`px-6 py-2 uppercase tracking-wider text-xs font-semibold ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>Pedidos</button>
                </div>
            )}

            {(!isOwner || activeTab === 'galleries') && (
                <>
                    {isOwner && (
                        <div className="bg-neutral-100 p-6 mb-10 border border-neutral-200">
                            <h3 className="text-xl tracking-tight mb-4 font-medium text-gray-800">Agregar Nueva Galería (PDF)</h3>
                            <form onSubmit={handleCreateGallery} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Nombre</label>
                                    <input type="text" required className="w-full border border-gray-300 px-4 py-2 outline-none" value={newGallery.name} onChange={(e) => setNewGallery({ ...newGallery, name: e.target.value })} />
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">URL del PDF</label>
                                    <input type="url" required className="w-full border border-gray-300 px-4 py-2 outline-none" value={newGallery.pdfUrl} onChange={(e) => setNewGallery({ ...newGallery, pdfUrl: e.target.value })} />
                                </div>
                                <button type="submit" disabled={isCreatingGallery} className="bg-black text-white px-8 py-2 border border-black uppercase text-sm tracking-widest font-semibold h-[42px]">{isCreatingGallery ? 'Subiendo...' : 'Subir Galería'}</button>
                            </form>
                        </div>
                    )}

                    <div className="mb-12">
                        <h2 className="text-2xl font-light mb-6 tracking-tight">Galerías del Evento</h2>
                        {galleries.length === 0 ? (
                            <p className="text-gray-500 bg-gray-50 p-6 text-center border border-gray-100">Aún no hay galerías.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {galleries.map(g => (
                                    <div key={g._id} className="border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:bg-neutral-50 transition-colors gap-4">
                                        <span className="text-lg font-medium break-all">{g.name}</span>
                                        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full sm:w-auto">
                                            <a href={g.pdfUrl} target="_blank" rel="noreferrer" className="text-center border border-black px-4 py-2 uppercase text-xs font-semibold hover:bg-black hover:text-white transition-colors">Abrir PDF</a>
                                            {isOwner && (
                                                <button onClick={() => handleDeleteGallery(g._id)} className="border border-red-600 px-4 py-2 uppercase text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white transition-colors">Eliminar</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Vista de Pedidos para el Dueño */}
            {isOwner && activeTab === 'orders' && (
                <div className="mb-12">
                    <h2 className="text-2xl font-light mb-6 tracking-tight">Pedidos de los Clientes</h2>
                    {orders.length === 0 ? (
                        <p className="text-gray-500 bg-gray-50 p-6 text-center border border-gray-100">Aún no hay pedidos.</p>
                    ) : (
                        <div className="space-y-6">
                            {orders.map(order => (
                                <div key={order._id} className="border border-gray-200 p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-100 gap-4">
                                        <div>
                                            <h4 className="text-xl font-medium break-all">{order.clientName}</h4>
                                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="text-left sm:text-right flex items-center sm:items-end gap-4 sm:gap-1 sm:flex-col w-full sm:w-auto justify-between sm:justify-start">
                                            <span className="block text-2xl font-light">${order.total}</span>
                                            <span className="text-xs uppercase tracking-wider font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded inline-block">{order.status}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between text-sm text-gray-700 bg-gray-50 p-2 border border-gray-100">
                                                <span><span className="font-semibold">Foto #{item.photoNumber}</span> &mdash; {item.quantity} uni.</span>
                                                <span>${item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Carrito de Pedidos para el Cliente */}
            {!isOwner && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-gray-200 pt-12">

                    <div>
                        <h2 className="text-2xl font-light mb-6 tracking-tight">Armar Pedido</h2>
                        <form onSubmit={addToCart} className="bg-neutral-100 p-6 border border-neutral-200 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Número de Foto</label>
                                <input type="number" required placeholder="Ej. 142" className="w-full border border-gray-300 px-4 py-2 outline-none" value={cartItem.photoNumber} onChange={(e) => setCartItem({ ...cartItem, photoNumber: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Producto (Formato)</label>
                                <select required className="w-full border border-gray-300 px-4 py-2 outline-none bg-white" value={cartItem.productId} onChange={(e) => setCartItem({ ...cartItem, productId: e.target.value })}>
                                    <option value="">Seleccionar producto</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name} - ${p.price}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Cantidad</label>
                                <input type="number" min="1" required className="w-full border border-gray-300 px-4 py-2 outline-none" value={cartItem.quantity} onChange={(e) => setCartItem({ ...cartItem, quantity: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-black text-white px-8 py-3 uppercase text-sm tracking-widest font-semibold">Agregar al Carrito</button>
                        </form>
                    </div>

                    <div>
                        <h2 className="text-2xl font-light mb-6 tracking-tight">Tu Carrito</h2>
                        {orderSuccess ? (
                            <div className="bg-green-50 text-green-700 p-6 border border-green-200 text-center">
                                <h4 className="text-lg font-medium mb-2">¡Pedido enviado con éxito!</h4>
                                <p>Pronto el estudio se pondrá en contacto contigo.</p>
                            </div>
                        ) : cart.length === 0 ? (
                            <p className="text-gray-500 bg-gray-50 p-6 text-center border border-gray-100">Agrega fotos para comenzar.</p>
                        ) : (
                            <div className="bg-white border border-gray-200 p-6">
                                <div className="space-y-4 mb-6">
                                    {cart.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 text-sm">
                                            <div>
                                                <span className="font-semibold block">Foto #{item.photoNumber}</span>
                                                <span className="text-gray-500">{item.productName} (x{item.quantity})</span>
                                            </div>
                                            <span className="font-medium">${item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-2 text-lg font-semibold">
                                        <span>Total</span>
                                        <span>${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                                    </div>
                                </div>
                                <form onSubmit={handleCreateOrder}>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Tu Nombre Completo</label>
                                    <input type="text" required placeholder="Juan Pérez" className="w-full border border-gray-300 px-4 py-2 outline-none mb-4" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                                    <button type="submit" disabled={isOrdering} className="w-full border border-black text-black hover:bg-black hover:text-white px-8 py-3 uppercase text-sm tracking-widest font-semibold transition-colors disabled:opacity-50">
                                        {isOrdering ? 'Procesando...' : 'Confirmar Pedido'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                </div>
            )}

        </div>
    );
};
