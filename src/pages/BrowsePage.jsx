import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EBOOKS } from '../data/ebooks';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const BrowsePage = () => {
  const { addToCart } = useCart();
  const [addedSlugs, setAddedSlugs] = useState({});

  const handleAddToCart = (ebook) => {
    addToCart({
        ...ebook,
        displayPrice: ebook.slug === 'ai-bundle' ? 'R297' : 'R97' // Match promo prices
    });
    setAddedSlugs(prev => ({ ...prev, [ebook.slug]: true }));
    setTimeout(() => {
      setAddedSlugs(prev => ({ ...prev, [ebook.slug]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <header className="bg-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Supercharge Your Service Business with AI
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Our educational eBooks show you exactly how you're leaking revenue — and how to fix it with AI.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/ebook/ai-bundle" 
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold transition transform hover:scale-105"
            >
              View Flagship Bundle
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-20 px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Available eBooks</h2>
            <p className="text-slate-500">Pick individual guides or grab the complete bundle.</p>
          </div>
          <Link to="/cart" className="hidden md:flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition shadow-sm">
            Go to Checkout
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(EBOOKS).map((ebook) => {
            const isBundle = ebook.slug === 'ai-bundle';
            const price = isBundle ? 'R297' : 'R97';
            const originalPrice = isBundle ? 'R497' : 'R197';

            return (
              <div key={ebook.slug} className={`bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 flex flex-col ${isBundle ? 'md:col-span-2 lg:col-span-1 ring-4 ring-red-600/10' : ''}`}>
                <div className="relative h-64 overflow-hidden group">
                  <img 
                    src={ebook.coverImage} 
                    alt={ebook.title} 
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=eBook+Cover'; }}
                  />
                  {isBundle && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      BEST VALUE
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 leading-tight h-14 overflow-hidden">
                    {ebook.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 flex-1">
                    {ebook.tagline}
                  </p>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-2xl font-extrabold text-slate-900">{price}</span>
                    <span className="text-slate-400 line-through text-sm">{originalPrice}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => handleAddToCart(ebook)}
                      className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${addedSlugs[ebook.slug] ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                    >
                      {addedSlugs[ebook.slug] ? 'Added!' : 'Add to Cart'}
                      {!addedSlugs[ebook.slug] && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </button>
                    <Link 
                      to={`/ebook/${ebook.slug}`}
                      className="w-full py-4 rounded-xl font-bold text-slate-600 hover:text-red-600 transition flex items-center justify-center gap-2 border border-slate-100 hover:border-red-100"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-white py-20 px-4 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm mb-4 italic">Empowering South African SMEs with AI</p>
        <div className="text-slate-300 text-xs">
          &copy; 2026 ReviveX Digital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default BrowsePage;
