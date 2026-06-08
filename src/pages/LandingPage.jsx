import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Download, CreditCard, ShieldCheck, Ticket } from 'lucide-react';

const LandingPage = ({ ebook, onCheckout, onApplyCoupon }) => {
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    const success = onApplyCoupon(coupon);
    if (success) {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Promo Banner */}
      {ebook.isPromo && (
        <div className="bg-revivex-red text-white text-center py-2 text-sm font-bold animate-pulse">
          LAUNCH PROMO: R97 for the first 50 buyers! (Selling Fast)
        </div>
      )}

      {/* Hero Section */}
      <header className="bg-revivex-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              {ebook.title}
            </h1>
            <p className="text-xl mb-8 opacity-90">
              {ebook.tagline}
            </p>
            <div className="flex flex-col gap-4 items-center md:items-start">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white">{ebook.displayPrice}</span>
                {ebook.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">{ebook.originalPrice}</span>
                )}
              </div>
              <button 
                onClick={onCheckout}
                className="bg-revivex-red text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg"
              >
                Get Your Copy Now <ArrowRight className="w-5 h-5" />
              </button>
              
              {!couponApplied && !ebook.isPromo && (
                <button 
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-1"
                >
                  <Ticket className="w-4 h-4" /> Have a coupon?
                </button>
              )}
              
              {showCoupon && !couponApplied && (
                <form onSubmit={handleApply} className="flex gap-2">
                  <input 
                    type="text" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter code"
                    className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-revivex-red"
                  />
                  <button type="submit" className="bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors">Apply</button>
                </form>
              )}

              {couponApplied && (
                <div className="text-green-400 text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Coupon Applied!
                </div>
              )}
            </div>
          </div>
          <div className="w-64 h-80 bg-gray-200 rounded-lg shadow-2xl flex items-center justify-center text-gray-500 border-4 border-revivex-red overflow-hidden relative group">
            {ebook.coverImage ? (
              <img src={ebook.coverImage} alt={ebook.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-center p-4">eBook Cover Placeholder</span>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <Download className="text-white w-12 h-12" />
            </div>
          </div>
        </div>
      </header>

      {/* Social Proof / Stats */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-revivex-red">1,000+</div>
            <div className="text-gray-600">eBooks Sold</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-revivex-red">5/5</div>
            <div className="text-gray-600">Customer Rating</div>
          </div>
          <div>
             <div className="text-3xl font-bold text-revivex-red">Instant</div>
             <div className="text-gray-600">PDF Delivery</div>
          </div>
        </div>
      </section>

      {/* Pain Points / Value Prop */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center text-revivex-black">What You'll Learn Inside</h2>
          <div className="grid md:grid-cols-1 gap-6">
            {ebook.learnings.map((learning, i) => (
              <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-revivex-red transition-all">
                <CheckCircle className="w-6 h-6 text-revivex-red flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700 font-medium">{learning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-revivex-black text-white px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Stop Leaking Leads Today</h2>
          <p className="text-xl mb-8 text-gray-400">
            Join hundreds of South African service-business owners who have stopped the revenue bleed and reclaimed their time.
          </p>
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl font-bold text-white">{ebook.displayPrice}</span>
              {ebook.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">{ebook.originalPrice}</span>
              )}
            </div>
            {ebook.isPromo && <p className="text-revivex-red text-sm font-bold uppercase tracking-wider">Limited Launch Offer</p>}
          </div>
          <button 
            onClick={onCheckout}
            className="w-full bg-revivex-red text-white px-8 py-5 rounded-lg font-bold text-xl hover:bg-red-700 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl"
          >
            <CreditCard className="w-6 h-6" /> Buy Now
          </button>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <ShieldCheck className="w-4 h-4" /> Secure Payment via PayFast / Stripe
          </div>
        </div>
      </section>

      {/* Demo Booking CTA */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <h3 className="text-2xl font-bold mb-4 text-revivex-black">Tired of answering the phone yourself?</h3>
           <p className="text-gray-600 mb-8 max-w-lg mx-auto">See how ReviveX's AI agents can handle your calls, book your appointments, and follow up with leads 24/7.</p>
           <a 
            href="https://revivexdigital.co.za/demo" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-revivex-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
           >
             Book a Free AI Demo <ArrowRight className="w-4 h-4" />
           </a>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} ReviveX Digital. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
