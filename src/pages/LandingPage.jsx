import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const LandingPage = ({ ebook, onCheckout, onApplyCoupon }) => {
  const { addToCart, cartItems } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const paypalRef = useRef();

  const isInCart = cartItems.some(item => item.slug === ebook?.slug);

  useEffect(() => {
    if (window.paypal) {
      setPaypalLoaded(true);
    } else {
      const interval = setInterval(() => {
        if (window.paypal) {
          setPaypalLoaded(true);
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (paypalLoaded && window.paypal && paypalRef.current) {
      console.log("LandingPage useEffect: rendering buttons...");
      try {
        paypalRef.current.innerHTML = '';
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            const zarAmount = parseFloat(ebook.displayPrice.replace('R', ''));
            const usdAmount = (zarAmount / 19).toFixed(2);
            return actions.order.create({
              purchase_units: [{
                description: ebook.title,
                amount: { currency_code: 'USD', value: usdAmount },
                payee: { email_address: 'chrisparryphoto@gmail.com' }
              }],
            });
          },
          onApprove: async (data, actions) => {
            await actions.order.capture();
            onCheckout();
          },
          style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'buy' }
        }).render(paypalRef.current);
      } catch (err) {
        console.error("PayPal Button Render Error:", err);
      }
    }
  }, [paypalLoaded, ebook?.displayPrice]);

  if (!ebook) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );

  const handleApply = (e) => {
    e.preventDefault();
    if (onApplyCoupon(coupon)) {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code');
    }
  };

  const getAssetPath = (path) => {
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return cleanBase + cleanPath;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <header className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
              Limited Time Launch Offer
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {ebook.title}
            </h1>
            <p className="text-xl mb-8 text-slate-300">
              {ebook.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button 
                onClick={() => {
                  addToCart(ebook);
                  setAddedToCart(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className={`${addedToCart ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'} text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-xl`}
              >
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                {!addedToCart && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>
              <a 
                href="#checkout" 
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2 transition-all"
              >
                Buy Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
          <div className="w-64 md:w-80 shadow-2xl rounded-lg overflow-hidden border-4 border-slate-700">
            <img 
              src={getAssetPath(ebook.coverImage)} 
              alt={ebook.title} 
              className="w-full h-auto object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=eBook+Cover'; }}
            />
          </div>
        </div>
      </header>

      {/* Learn Section */}
      <main id="learn" className="py-20 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What you'll discover inside</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">The exact strategies we use to help South African service businesses automate and scale.</p>
        </div>
        
        <div className="grid md:grid-cols-1 gap-6">
          {ebook.learnings && ebook.learnings.map((item, i) => (
            <div key={i} className="flex gap-4 items-start bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:border-red-200 transition shadow-sm">
              <div className="bg-green-100 text-green-600 rounded-full p-1 mt-1 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg font-medium text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Checkout Section */}
      <section id="checkout" className="py-20 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-5 border border-slate-200">
          <div className="md:col-span-2 bg-slate-900 p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">Order Summary</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">Standard Price:</span>
                <span className="text-slate-400 line-through">{ebook.originalPrice || 'R197'}</span>
              </div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-white font-bold">Launch Discount:</span>
                <span className="text-green-400 font-bold">-{couponApplied ? 'R150' : 'R100'}</span>
              </div>
              <div className="border-t border-slate-700 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-slate-400">You Pay:</span>
                  <span className="text-4xl font-extrabold text-white">{ebook.displayPrice}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 italic">Converted to USD for PayPal processing</p>
              </div>
            </div>

            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 text-sm text-slate-300 mb-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure PDF Delivery
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Instant Access
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3 p-10">
            <h4 className="text-xl font-bold mb-8">Complete Purchase</h4>
            
            <div className="space-y-6">
              {!showCoupon ? (
                <button 
                  onClick={() => setShowCoupon(true)}
                  className="text-slate-500 text-sm hover:text-red-600 transition underline underline-offset-4"
                >
                  Have a coupon code?
                </button>
              ) : (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input 
                    type="text" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter code" 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                  <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition">
                    Apply
                  </button>
                </form>
              )}

              {couponApplied && (
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium border border-green-100">
                  Coupon applied successfully! R50 extra discount added.
                </div>
              )}

              <div className="pt-4 min-h-[150px] flex flex-col justify-center">
                {!paypalLoaded ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="animate-spin rounded-full h-8 w-12 border-b-2 border-red-600"></div>
                    <p className="text-slate-400 text-sm">Connecting to secure payment gateway...</p>
                  </div>
                ) : (
                  <div ref={paypalRef} className="w-full"></div>
                )}
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center gap-6 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Questions? Contact us at <a href="mailto:support@revivexdigital.com" className="text-slate-600 font-medium hover:text-red-600 transition">support@revivexdigital.com</a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white text-center border-t border-slate-100">
        <p className="text-slate-400 text-sm italic mb-4">
          Empowering South African SMEs with AI
        </p>
        <div className="text-slate-300 text-xs">
          &copy; 2026 ReviveX Digital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
