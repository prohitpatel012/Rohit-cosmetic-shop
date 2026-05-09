"use client";

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Sparkles } from 'lucide-react';
import Link from 'next/link';

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch categories and products
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ]).then(([cats, prods]) => {
      setCategories(Array.isArray(cats) ? cats : []);
      setProducts(Array.isArray(prods) ? prods : []);
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
        <div className="flex items-center justify-between px-4 h-14 w-full">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 cursor-pointer">
              {/* Custom Logo for Rohit Cosmetic Shop */}
              <div className="bg-pink-600 text-white p-1.5 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 ml-1 hidden sm:block">Rohit Cosmetic</span>
              <span className="text-xl font-bold tracking-tight text-gray-900 ml-1 sm:hidden">Rohit</span>
            </div>
          </div>

          {/* Center: Search Bar (YouTube Style) */}
          <div className="hidden md:flex flex-1 max-w-[600px] ml-10 items-center">
            <div className="flex w-full items-center">
              <div className="flex w-full border border-gray-300 rounded-l-full px-4 py-2 focus-within:border-blue-600 focus-within:ml-0 ml-[32px] bg-white relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden peer-focus:block">
                  <Search className="w-4 h-4 text-gray-800" />
                </div>
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
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-6 h-6 text-gray-900" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart className="w-6 h-6 text-gray-900" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white"></div>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-1">
              <User className="w-6 h-6 text-gray-900" />
            </button>
          </div>
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
            {filteredProducts.map(product => (
              <Link href={`/product/${product._id}`} key={product._id} className="flex flex-col group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative w-full aspect-video sm:rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={product.image || 'https://via.placeholder.com/600x338'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {product.discount > 0 && (
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                  {/* Price overlay acting like the video duration */}
                  <div className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                    ${product.price.toFixed(2)}
                  </div>
                </div>

                {/* Details */}
                <div className="flex gap-3 mt-3 pr-6">
                  {/* Avatar representing shop/brand */}
                  <div className="w-9 h-9 bg-pink-100 rounded-full shrink-0 flex items-center justify-center text-pink-700 font-bold mt-0.5 shadow-sm border border-pink-200">
                    {product.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 hover:text-gray-900 transition-colors">
                      {product.category?.name || 'Unknown Category'}
                    </p>
                    <div className="flex items-center text-sm text-gray-600 mt-0.5">
                      <span className={product.isavailable ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {product.isavailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
