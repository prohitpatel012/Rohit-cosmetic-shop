"use client";

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, ArrowLeft, LogOut, Shield, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
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

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { setIsCartOpen, cartCount, cart, addToCart, updateQuantity } = useCart();
  const [session, setSession] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Fetch categories and products
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/products').then(res => res.json()),
      fetch('/api/auth/session').then(res => res.json().catch(() => ({})))
    ]).then(([cats, prods, sess]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setProducts(Array.isArray(prods) ? prods : []);
      if (sess?.authenticated) setSession(sess.user);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredProducts = products.filter(p =>
    (activeCategory === 'All' || p.category?._id === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky Header exactly like the screenshot */}
      <header className="sticky top-0 z-50 bg-white flex flex-col w-full">
        {/* Layer 1: Top Bar */}
        <div className="flex items-center justify-between px-4 h-14 w-full relative">

          {/* Mobile Search View Overlay */}
          {isSearchOpen ? (
            <div className="flex items-center w-full bg-white z-10 gap-2 h-full">
              <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                <ArrowLeft className="w-6 h-6 text-gray-900" />
              </button>
              <div className="flex flex-1 items-center bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full outline-none bg-transparent text-base"
                  autoFocus
                />
              </div>
            </div>
          ) : (
            <>
              {/* Left: Logo */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 cursor-pointer">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Rohit Cosmetic Shop</span>
                </div>
              </div>

              {/* Center: Search Bar (Desktop) */}
              <div className="hidden md:flex flex-1 max-w-[600px] ml-10 items-center">
                <div className="flex w-full items-center">
                  <div className="flex w-full border border-gray-300 rounded-l-full px-4 py-2 focus-within:border-blue-600 bg-white relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full outline-none bg-transparent text-base peer"
                    />
                  </div>
                  <button className="bg-gray-50 border border-l-0 border-gray-300 rounded-r-full px-5 py-2 hover:bg-gray-100 transition-colors tooltip relative group">
                    <Search className="w-5 h-5 text-gray-800" />
                  </button>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={() => setIsSearchOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Search className="w-6 h-6 text-gray-900" />
                </button>
                <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                  <ShoppingCart className="w-6 h-6 text-gray-900" />
                  {cartCount > 0 && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                      {cartCount}
                    </div>
                  )}
                </button>
                
                <div className="relative">
                  {session ? (
                    <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold ml-1 hover:bg-pink-700 transition-colors shadow-sm focus:outline-none">
                      {session.name.charAt(0).toUpperCase()}
                    </button>
                  ) : (
                    <Link href="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-1 inline-block">
                      <User className="w-6 h-6 text-gray-900" />
                    </Link>
                  )}

                  {showProfileMenu && session && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{session.name}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{session.role}</p>
                      </div>
                      
                      {session.role === 'admin' && (
                        <Link href="/admin" className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                          <Shield className="w-4 h-4 text-pink-600" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button 
                        onClick={async () => {
                          await fetch('/api/auth/logout', { method: 'POST' });
                          setSession(null);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Layer 2: Categories (Pills) */}
        <div className="flex items-center px-4 h-14 border-t border-b border-gray-200 w-full relative bg-white">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full py-2">
            <button
              onClick={() => setActiveCategory('All')}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'All' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat._id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {/* Faded right edge to indicate scrolling */}
          <div className="absolute right-0 w-24 h-full bg-gradient-to-l from-white via-white to-transparent pointer-events-none flex justify-end items-center pr-4">
            <div className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer pointer-events-auto bg-white shadow-sm border border-gray-100">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - YouTube Style Grid */}
      <main className="flex-1 p-4 sm:p-6 w-full bg-gray-50/30">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="animate-pulse flex flex-col gap-3">
                <div className="bg-gray-200 w-full aspect-video rounded-xl"></div>
                <div className="flex gap-3 mt-1">
                  <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0"></div>
                  <div className="flex flex-col gap-2 w-full mt-1">
                    <div className="h-4 bg-gray-200 rounded w-[90%]"></div>
                    <div className="h-3 bg-gray-200 rounded w-[60%]"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="mt-2 text-sm">Try selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {filteredProducts.map(product => {
              const finalPrice = product.price - (product.price * (product.discount / 100));
              const cartItem = cart.find(item => item._id === product._id);
              return (
                <div key={product._id} className="flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                  {/* Image Container */}
                  <div 
                    onClick={() => router.push(`/product/${product._id}`)}
                    className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4 cursor-pointer"
                  >
                    <img
                      src={product.image || 'https://via.placeholder.com/600'}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Details Section */}
                  <div className="flex flex-col p-4 flex-1">
                    <h3 
                      onClick={() => router.push(`/product/${product._id}`)}
                      className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-snug hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="mt-auto pt-4">
                      {/* Pricing */}
                      <div className="flex items-center flex-wrap gap-1.5 mb-1">
                        <span className="text-lg sm:text-xl font-bold text-gray-900">
                          ${finalPrice.toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs sm:text-sm text-gray-500 line-through ml-1">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart logic */}
                      <div className="mt-3 h-10">
                        {!product.isavailable ? (
                           <button disabled className="w-full h-full bg-gray-100 text-gray-400 font-bold rounded-lg text-sm cursor-not-allowed">
                             Out of Stock
                           </button>
                        ) : cartItem ? (
                          <div className="w-full h-full flex items-center justify-between border border-pink-600 rounded-lg overflow-hidden bg-pink-50">
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateQuantity(product._id, cartItem.quantity - 1); }}
                              className="w-10 h-full flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-pink-600 text-sm">{cartItem.quantity}</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); updateQuantity(product._id, cartItem.quantity + 1); }}
                              className="w-10 h-full flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            className="w-full h-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                          >
                            <ShoppingCart className="w-4 h-4" /> Add to Basket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
