'use client';

import { useState, useEffect, useMemo } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCouch, FaTag, FaSearch } from 'react-icons/fa';

interface Product {
  id?: string;
  _id?: string;
  furniture_name: string;
  furniture_type: string;
  furniture_price: number;
  furniture_description: string;
  special_description?: string;
  furniture_image?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [addName, setAddName] = useState('');
  const [addCategory, setAddCategory] = useState('Sofa');
  const [addPrice, setAddPrice] = useState('');
  const [addSpecial, setAddSpecial] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addImageUrl, setAddImageUrl] = useState('');

  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editSpecial, setEditSpecial] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/furniture');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered products based on search query and category filter
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (categoryFilter !== 'ALL' && product.furniture_type !== categoryFilter) {
        return false;
      }

      // Search query filter (matches name, description, special note, or category)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = product.furniture_name?.toLowerCase().includes(query);
        const descMatch = product.furniture_description?.toLowerCase().includes(query);
        const specialMatch = product.special_description?.toLowerCase().includes(query);
        const typeMatch = product.furniture_type?.toLowerCase().includes(query);
        return nameMatch || descMatch || specialMatch || typeMatch;
      }

      return true;
    });
  }, [products, searchQuery, categoryFilter]);

  // Extract unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.furniture_type) set.add(p.furniture_type);
    });
    return Array.from(set);
  }, [products]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addCategory) {
      alert('Please fill in required fields.');
      return;
    }

    const cleanPrice = addPrice ? parseFloat(addPrice.replace(/[^\d.-]/g, '')) : 0;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/furniture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          furniture_name: addName,
          furniture_type: addCategory,
          furniture_price: cleanPrice,
          special_description: addSpecial.trim(),
          furniture_description: addDesc.trim(),
          furniture_image: addImageUrl.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Product created successfully!');
        closeModals();
        fetchProducts();
      } else {
        alert(data.message || 'Failed to create product');
      }
    } catch (err) {
      alert('Error creating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productId = selectedProduct?.id || selectedProduct?._id;
    if (!productId) return;

    const cleanPrice = parseFloat(editPrice.toString().replace(/[^\d.-]/g, ''));

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/furniture/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          furniture_name: editName,
          furniture_type: editCategory,
          furniture_price: isNaN(cleanPrice) ? undefined : cleanPrice,
          special_description: editSpecial,
          furniture_description: editDesc,
          furniture_image: editImageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert('Product updated successfully!');
        closeModals();
        fetchProducts();
      } else {
        alert(data.message || 'Failed to update product');
      }
    } catch (err) {
      alert('Error updating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/furniture/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Product deleted successfully');
        closeModals();
        fetchProducts();
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Network error while deleting product');
    }
  };

  const openAddModal = () => {
    setAddName('');
    setAddCategory('Sofa');
    setAddPrice('');
    setAddSpecial('');
    setAddDesc('');
    setAddImageUrl('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setEditName(product.furniture_name);
    setEditCategory(product.furniture_type);
    setEditPrice((product.furniture_price || 0).toString());
    setEditSpecial(product.special_description || '');
    setEditDesc(product.furniture_description || '');
    setEditImageUrl(product.furniture_image || '');
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Products</h1>
          <p className="text-amber-700 mt-1">Manage your furniture catalog</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-700 hover:bg-amber-800 text-white px-4 py-2.5 rounded-lg font-medium flex items-center transition duration-300 shadow-sm cursor-pointer"
        >
          <FaPlus className="mr-2" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-600">
            <FaSearch />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, category, note..."
            className="w-full pl-10 pr-10 py-2.5 bg-amber-50/50 border border-amber-200 rounded-lg text-sm text-gray-800 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 cursor-pointer"
              title="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>

        {/* Category Filter & Stats */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-2">
            <label htmlFor="catFilter" className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              Category:
            </label>
            <select
              id="catFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-amber-50/50 border border-amber-200 rounded-lg text-xs font-medium text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="ALL">All Categories ({products.length})</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs font-medium text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full">
            Showing {filteredProducts.length} of {products.length}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-100">
        <table className="min-w-full divide-y divide-amber-100">
          <thead className="bg-amber-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider">
                Special Note / Finish
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-amber-100">
            {filteredProducts.map((product) => {
              const productId = product.id || product._id || '';
              return (
                <tr key={productId} className="hover:bg-amber-50/80 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-lg mr-3 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {product.furniture_image ? (
                          <img
                            src={product.furniture_image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaCouch className="text-amber-700 text-lg" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-amber-900">{product.furniture_name}</div>
                        <div className="text-stone-500 text-xs line-clamp-1">{product.furniture_description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-amber-700">
                    <div className="flex items-center text-sm">
                      <FaTag className="mr-2 text-amber-600 text-xs" />
                      {product.furniture_type?.replace(/_/g, ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">
                    {product.special_description || 'Made to order'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-amber-700 hover:text-amber-900 mr-4 cursor-pointer p-1"
                      title="Edit Product"
                    >
                      <FaEdit className="inline text-base" />
                    </button>
                    <button
                      onClick={() => handleDelete(productId)}
                      className="text-red-600 hover:text-red-900 cursor-pointer p-1"
                      title="Delete Product"
                    >
                      <FaTrash className="inline text-base" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FaCouch className="text-4xl text-amber-400 mx-auto mb-2" />
            <p className="text-amber-800 font-medium">No products match your search criteria.</p>
            {(searchQuery || categoryFilter !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('ALL');
                }}
                className="mt-3 text-xs font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer"
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-amber-200 flex justify-between items-center p-6">
              <h2 className="text-2xl font-bold text-amber-900">Add New Product</h2>
              <button onClick={closeModals} className="text-amber-700 hover:text-amber-900 cursor-pointer">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-800 font-medium mb-1 text-sm">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Modern Leather Sofa"
                  />
                </div>
                <div>
                  <label className="block text-amber-800 font-medium mb-1 text-sm">Category *</label>
                  <select
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Sofa">Sofa</option>
                    <option value="Bed">Bed</option>
                    <option value="Book_Shelf">Book_Shelf</option>
                    <option value="Shoe_Rack">Shoe_Rack</option>
                    <option value="Floating_Shelf">Floating_Shelf</option>
                    <option value="Wardrobe">Wardrobe</option>
                    <option value="Kitchen_Cabinet">Kitchen_Cabinet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-amber-800 font-medium mb-1 text-sm">Special Badge / Note</label>
                  <input
                    type="text"
                    value={addSpecial}
                    onChange={(e) => setAddSpecial(e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. 10% Discount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-800 font-medium mb-1 text-sm">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="Describe dimensions, materials, and features..."
                />
              </div>

              <div>
                <label className="block text-amber-800 font-medium mb-1 text-sm">Image URL</label>
                <input
                  type="url"
                  value={addImageUrl}
                  onChange={(e) => setAddImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              {addImageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-amber-700 mb-1">Image Preview:</p>
                  <img
                    src={addImageUrl}
                    alt="Preview"
                    className="h-36 w-full object-cover rounded-lg border border-amber-200"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-amber-200">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-5 py-2.5 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-amber-200 flex justify-between items-center p-6">
              <h2 className="text-2xl font-bold text-amber-900">Edit Product</h2>
              <button onClick={closeModals} className="text-amber-700 hover:text-amber-900 cursor-pointer">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-amber-800 font-medium mb-1 text-sm">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-amber-800 font-medium mb-1 text-sm">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Sofa">Sofa</option>
                    <option value="Bed">Bed</option>
                    <option value="Book_Shelf">Book_Shelf</option>
                    <option value="Shoe_Rack">Shoe_Rack</option>
                    <option value="Floating_Shelf">Floating_Shelf</option>
                    <option value="Wardrobe">Wardrobe</option>
                    <option value="Kitchen_Cabinet">Kitchen_Cabinet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-amber-800 font-medium mb-1 text-sm">Special Badge</label>
                  <input
                    type="text"
                    value={editSpecial}
                    onChange={(e) => setEditSpecial(e.target.value)}
                    className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-800 font-medium mb-1 text-sm">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-amber-800 font-medium mb-1 text-sm">Image URL</label>
                <input
                  type="url"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {editImageUrl && (
                <div className="mt-2">
                  <p className="text-xs text-amber-700 mb-1">Image Preview:</p>
                  <img
                    src={editImageUrl}
                    alt="Preview"
                    className="h-36 w-full object-cover rounded-lg border border-amber-200"
                  />
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedProduct.id || selectedProduct._id || '')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm flex items-center cursor-pointer"
                >
                  <FaTrash className="mr-2" /> Delete Product
                </button>
                <div className="space-x-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-5 py-2.5 border border-amber-300 text-amber-800 rounded-lg hover:bg-amber-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-medium disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}