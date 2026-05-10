"use client";

import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, ShoppingBag, PhoneIcon as WhatsApp } from 'lucide-react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleOrderWhatsApp = () => {
    const phoneNumber = "919876543210"; // Replace with real WhatsApp number
    let message = "Hello! I would like to place an order for the following items:\n\n";
    
    cart.forEach(item => {
      const finalPrice = item.price - (item.price * (item.discount / 100));
      message += `- ${item.name} (x${item.quantity}) - $${(finalPrice * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Total Amount: $${cartTotal.toFixed(2)}*\n\n`;
    message += "Please let me know the payment details and delivery process. Thank you!";
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gray-900" />
            <h2 className="text-xl font-bold text-gray-900">Your Basket</h2>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full ml-1">
              {cart.length} items
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <p className="text-lg font-medium">Your basket is empty</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-pink-600 font-medium hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => {
                const finalPrice = item.price - (item.price * (item.discount / 100));
                return (
                  <div key={item._id} className="flex gap-4 items-start">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight mb-1">{item.name}</h3>
                      <p className="text-pink-600 font-bold text-sm">${finalPrice.toFixed(2)}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-50 text-gray-500 rounded-l-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-50 text-gray-500 rounded-r-lg transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-green-800 text-center font-medium mb-1">
                To place your order, please contact us on WhatsApp!
              </p>
              <p className="text-xs text-green-600 text-center">
                Shop Address: 123 Beauty Lane, Mumbai
              </p>
            </div>

            <button 
              onClick={handleOrderWhatsApp}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
            >
              <WhatsApp className="w-5 h-5" />
              Order via WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
