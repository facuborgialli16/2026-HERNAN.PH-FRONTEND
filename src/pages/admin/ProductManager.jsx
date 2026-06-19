import { useState, useEffect } from 'react';
import { apiClient } from '../../api/axiosConfig';

export const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '' });
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState('');

    // Estados para la edicion
    const [editingProduct, setEditingProduct] = useState(null);

    const loadProducts = async () => {
        try {
            const res = await apiClient.get('/api/products');
            if (res.data && res.data.ok !== false) {
                setProducts(res.data.data.products || []);
            }
        } catch (err) {
            setError('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await apiClient.post('/api/products', {
                name: newProduct.name,
                price: Number(newProduct.price)
            });
            setNewProduct({ name: '', price: '' });
            await loadProducts();
        } catch (err) {
            alert('Error: ' + (err.response?.data?.message || err.message));
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();
        try {
            await apiClient.put(`/api/products/${id}`, {
                name: editingProduct.name,
                price: Number(editingProduct.price)
            });
            setEditingProduct(null);
            await loadProducts();
        } catch (err) {
            alert("Error al actualizar el producto");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro que deseas eliminar este producto? (Se borrará permanentemente)")) return;
        try {
            await apiClient.delete(`/api/products/${id}`);
            await loadProducts();
        } catch (err) {
            alert("Error al eliminar el producto");
        }
    };

    return (
        <div className="py-10 max-w-4xl mx-auto px-4 md:px-0">
            <h2 className="text-3xl font-light tracking-tight mb-8">Administrar Productos</h2>

            <form onSubmit={handleCreate} className="bg-neutral-100 p-6 mb-10 border border-neutral-200 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Nombre del Producto</label>
                    <input
                        type="text"
                        required
                        className="w-full border border-gray-300 px-4 py-2 outline-none focus:border-black transition-colors"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Precio ($)</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        className="w-full border border-gray-300 px-4 py-2 outline-none focus:border-black transition-colors"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isCreating}
                    className="bg-black text-white px-8 py-2 border border-black hover:bg-neutral-800 transition-colors uppercase text-sm tracking-widest font-semibold whitespace-nowrap h-[42px] disabled:opacity-50"
                >
                    {isCreating ? 'Guardando...' : 'Crear Producto'}
                </button>
            </form>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            {loading ? (
                <p className="text-gray-500">Cargando productos...</p>
            ) : products.length === 0 ? (
                <p className="text-gray-500">No hay productos creados.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map(product => (
                        <div key={product._id} className="border border-gray-200 bg-white p-4 flex flex-col hover:shadow-sm transition-shadow">
                            {editingProduct && editingProduct._id === product._id ? (
                                <form onSubmit={(e) => handleUpdate(e, product._id)} className="flex flex-col sm:flex-row gap-3 w-full sm:items-center">
                                    <input
                                        required
                                        className="border border-gray-300 px-2 py-1 flex-1 text-sm outline-none"
                                        value={editingProduct.name}
                                        onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    />
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="border border-gray-300 px-2 py-1 w-20 text-sm outline-none"
                                        value={editingProduct.price}
                                        onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                    />
                                    <button type="submit" className="bg-black text-white px-2 py-1 text-xs font-semibold hover:bg-neutral-800 transition-colors">OK</button>
                                    <button type="button" onClick={() => setEditingProduct(null)} className="bg-gray-300 px-2 py-1 text-xs font-semibold hover:bg-gray-400 transition-colors">X</button>
                                </form>
                            ) : (
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
                                    <span className="font-medium text-lg">{product.name}</span>
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                                        <span className="bg-neutral-100 px-3 py-1 text-sm font-semibold border border-neutral-200">${product.price}</span>
                                        <button onClick={() => setEditingProduct(product)} className="text-blue-600 text-sm hover:underline cursor-pointer">Editar</button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-600 text-sm hover:underline cursor-pointer">Eliminar</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
