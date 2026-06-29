import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { EBOOKS } from '../data/ebooks';

const Navbar = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b py-4 px-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-red-600">ReviveX Digital</Link>
        
        <div className="flex items-center gap-6">
          <div className="relative group">
            <button className="text-sm font-medium text-gray-600 hover:text-red-600 transition flex items-center gap-1">
              Browse eBooks
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="py-2">
                {Object.values(EBOOKS).map((ebook) => (
                  <Link
                    key={ebook.slug}
                    to={`/ebook/${ebook.slug}`}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-slate-50 hover:text-red-600 transition"
                  >
                    <div className="font-bold mb-0.5 truncate">{ebook.title}</div>
                    <div className="text-xs text-gray-400">{ebook.price}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
