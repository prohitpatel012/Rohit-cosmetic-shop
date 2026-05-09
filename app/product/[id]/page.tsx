"use client";

import React, { useEffect, useState, use } from 'react';
import { ArrowLeft, ShoppingCart, Star, Share2 } from 'lucide-react';
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

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${unwrappedParams.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const discountedPrice = product.price - (product.price * (product.discount / 100));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Shop</span>
          </Link>
          <div className="flex items-center gap-4">
             <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Product Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-6 sm:p-10">
            {/* Image Section */}
            <div className="relative aspect-square sm:aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-pink-600 text-white font-bold px-3 py-1.5 rounded-lg shadow-md text-sm">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex flex-col justify-center">
              <span className="text-pink-600 font-semibold tracking-wider text-sm uppercase mb-2">
                {product.category?.name}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-6">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${product.isavailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.isavailable ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <div className="flex items-end gap-3 mb-8">
                <span className="text-4xl font-black text-gray-900">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="text-xl text-gray-400 line-through mb-1">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="prose prose-sm sm:prose-base text-gray-600 mb-8 leading-relaxed">
                <p>{product.description}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {product.isavailable ? (
                  <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                ) : (
                  <button disabled className="flex-1 bg-gray-200 text-gray-500 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                    Out of Stock
                  </button>
                )}
                <button className="bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold py-4 px-8 rounded-xl transition-colors">
                  Buy Now
                </button>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Secure Checkout
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Fast Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
