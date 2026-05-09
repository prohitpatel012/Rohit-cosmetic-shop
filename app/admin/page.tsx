"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Package, Layers, ArrowLeft, Loader2, Edit, Trash2, Plus, X, Check } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  description: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  discount: number;
  isavailable: boolean;
  category: Category;
}

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'categories' | 'products'>('dashboard');
  
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categoryFormRef = useRef<HTMLFormElement>(null);
  const productFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);
      const catData = await catRes.json();
      const prodData = await prodRes.json();
      
      setCategories(Array.isArray(catData) ? catData : []);
      setProducts(Array.isArray(prodData) ? prodData : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const description = formData.get('description');

    const url = editingCategory ? `/api/categories/${editingCategory._id}` : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        setShowCategoryForm(false);
        setEditingCategory(null);
        categoryFormRef.current?.reset();
        fetchData();
      }
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      name: formData.get('name'),
      description: formData.get('description'),
      image: formData.get('image'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      discount: Number(formData.get('discount') || 0),
      isavailable: formData.get('isavailable') === 'on'
    };

    const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowProductForm(false);
        setEditingProduct(null);
        productFormRef.current?.reset();
        fetchData();
      }
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
        <Loader2 className="w-10 h-10 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your cosmetic shop's inventory</p>
          </div>
          {view !== 'dashboard' && (
            <button 
              onClick={() => {
                setView('dashboard');
                setShowCategoryForm(false);
                setEditingCategory(null);
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              className="flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-white text-gray-700 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors self-start sm:self-auto w-full sm:w-auto justify-center sm:justify-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>

        {view === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div 
              onClick={() => setView('categories')}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Total Categories</p>
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 group-hover:text-pink-600 transition-colors">
                    {categories.length}
                  </h2>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-pink-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-pink-600">
                  <Layers className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center text-xs sm:text-sm text-pink-600 font-medium">
                View & Manage Categories &rarr;
              </div>
            </div>

            <div 
              onClick={() => setView('products')}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Total Products</p>
                  <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 sm:mt-3 group-hover:text-blue-600 transition-colors">
                    {products.length}
                  </h2>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-600">
                  <Package className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 flex items-center text-xs sm:text-sm text-blue-600 font-medium">
                View & Manage Products &rarr;
              </div>
            </div>
          </div>
        )}

        {view === 'categories' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 gap-3 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">All Categories</h2>
              <button 
                onClick={() => {
                  if (showCategoryForm && !editingCategory) {
                    setShowCategoryForm(false);
                  } else {
                    setEditingCategory(null);
                    setShowCategoryForm(true);
                  }
                }}
                className="flex items-center justify-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-colors w-full sm:w-auto"
              >
                {showCategoryForm && !editingCategory ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="text-sm sm:text-base">{showCategoryForm && !editingCategory ? 'Cancel' : 'New Category'}</span>
              </button>
            </div>

            {showCategoryForm && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-pink-100 p-4 sm:p-8 animate-in fade-in slide-in-from-top-4 relative">
                <button onClick={() => setShowCategoryForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
                <form ref={categoryFormRef} onSubmit={handleCategorySubmit} className="space-y-4 sm:space-y-5 max-w-2xl">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input required defaultValue={editingCategory?.name} name="name" type="text" className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm sm:text-base" placeholder="e.g., Skincare" />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required defaultValue={editingCategory?.description} name="description" rows={3} className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all text-sm sm:text-base" placeholder="Category description..."></textarea>
                  </div>
                  <div className="pt-2">
                    <button disabled={submitting} type="submit" className="flex items-center justify-center space-x-2 w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors disabled:opacity-70 text-sm sm:text-base">
                      {submitting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
                      <span>{editingCategory ? 'Save Changes' : 'Save Category'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Description</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 bg-gray-50/30">
                          <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                          <p className="text-sm sm:text-base">No categories found.</p>
                        </td>
                      </tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-normal">
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">{category.name}</div>
                            {/* Show description under name on mobile */}
                            <div className="text-xs text-gray-500 mt-1 sm:hidden line-clamp-1">{category.description}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                            <div className="text-xs sm:text-sm text-gray-600 line-clamp-2">{category.description}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right font-medium">
                            <button 
                              onClick={() => {
                                setEditingCategory(category);
                                setShowCategoryForm(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-3 bg-indigo-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(category._id)}
                              className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'products' && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 gap-3 sm:gap-0">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">All Products</h2>
              <button 
                onClick={() => {
                  if (showProductForm && !editingProduct) {
                    setShowProductForm(false);
                  } else {
                    setEditingProduct(null);
                    setShowProductForm(true);
                  }
                }}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-medium transition-colors w-full sm:w-auto"
              >
                {showProductForm && !editingProduct ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                <span className="text-sm sm:text-base">{showProductForm && !editingProduct ? 'Cancel' : 'New Product'}</span>
              </button>
            </div>
            
            {showProductForm && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-8 animate-in fade-in slide-in-from-top-4 relative">
                <button onClick={() => setShowProductForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">{editingProduct ? 'Edit Product' : 'Create New Product'}</h3>
                <form ref={productFormRef} onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input required defaultValue={editingProduct?.name} name="name" type="text" className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base" placeholder="e.g., Vitamin C Serum" />
                  </div>
                  
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea required defaultValue={editingProduct?.description} name="description" rows={3} className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base" placeholder="Detailed product description..."></textarea>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input required defaultValue={editingProduct?.image} name="image" type="url" className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base" placeholder="https://..." />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select required defaultValue={editingProduct?.category?._id} name="category" className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm sm:text-base">
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input required defaultValue={editingProduct?.price} name="price" type="number" step="0.01" min="0" className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base" placeholder="0.00" />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input defaultValue={editingProduct?.discount || 0} name="discount" type="number" min="0" max="100" className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm sm:text-base" />
                  </div>

                  <div className="col-span-1 sm:col-span-2 flex items-center space-x-2 sm:space-x-3 bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100 mt-1 sm:mt-2">
                    <input defaultChecked={editingProduct ? editingProduct.isavailable : true} name="isavailable" id="isavailable" type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                    <label htmlFor="isavailable" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">Product is available in stock</label>
                  </div>

                  <div className="col-span-1 sm:col-span-2 pt-2 sm:pt-4 border-t border-gray-100 mt-2">
                    <button disabled={submitting} type="submit" className="flex items-center justify-center space-x-2 w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors disabled:opacity-70 text-sm sm:text-base">
                      {submitting ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
                      <span>{editingProduct ? 'Save Changes' : 'Save Product'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 bg-gray-50/30">
                          <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
                          <p className="text-sm sm:text-base">No products found. Create one above!</p>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 sm:h-14 sm:w-14 flex-shrink-0 relative rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 bg-white">
                                <img className="h-full w-full object-cover" src={product.image || 'https://via.placeholder.com/150'} alt={product.name} />
                              </div>
                              <div className="ml-3 sm:ml-4 min-w-0">
                                <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-xs">{product.name}</div>
                                <div className="text-[10px] sm:text-sm text-gray-500 mt-0.5 truncate max-w-[120px] sm:max-w-xs">{product.category?.name || 'Unknown'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-bold text-gray-900">${product.price.toFixed(2)}</div>
                            {product.discount > 0 && (
                              <div className="text-[10px] sm:text-xs text-green-600 font-bold mt-1 bg-green-50 inline-block px-1.5 py-0.5 rounded-md">-{product.discount}%</div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            {product.isavailable ? (
                              <span className="flex items-center text-[10px] sm:text-sm text-green-700 font-semibold bg-green-50 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg w-fit border border-green-100">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1.5 sm:mr-2"></span>
                                In Stock
                              </span>
                            ) : (
                              <span className="flex items-center text-[10px] sm:text-sm text-red-700 font-semibold bg-red-50 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg w-fit border border-red-100">
                                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full mr-1.5 sm:mr-2"></span>
                                Out of Stock
                              </span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right font-medium">
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setShowProductForm(true);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-2 sm:mr-3 bg-indigo-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="inline-flex items-center text-red-600 hover:text-red-900 bg-red-50 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1.5" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
