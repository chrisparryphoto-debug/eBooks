import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ArrowRight, Download, CreditCard, ShieldCheck, Ticket } from 'lucide-react';

const LandingPage = ({ ebook, onCheckout, onApplyCoupon }) => {
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const paypalRef = useRef();

  console.log("LandingPage rendering with ebook:", ebook?.slug);

  useEffect(() => {
    if (!ebook) return;

    const renderPayPal = () => {
      if (window.paypal && paypalRef.current) {
        // Clear previous buttons if any
        paypalRef.current.innerHTML = '';
        
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            const zarAmount = parseFloat(ebook.displayPrice.replace('R', ''));
            const usdAmount = (zarAmount / 19).toFixed(2);
            
            return actions.order.create({
              purchase_units: [
                {
                  description: ebook.title,
                  amount: {
                    currency_code: 'USD',
                    value: usdAmount,
                  },
                  payee: {
                    email_address: 'chrisparryphoto@gmail.com'
                  }
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log('PayPal Order Captured:', order);
            onCheckout();
          },
          onCancel: (data) => {
            console.log('PayPal Payment Cancelled');
          },
          onError: (err) => {
            console.error('PayPal Error:', err);
          },
          style: {
            layout: 'vertical',
            color: 'black',
            shape: 'rect',
            label: 'buy'
          }
        }).render(paypalRef.current);
      } else {
        console.log("PayPal SDK not ready yet, retrying in 1s...");
        setTimeout(renderPayPal, 1000);
      }
    };

    renderPayPal();
  }, [ebook?.displayPrice]);

  if (!ebook) {
    return <div className="p-20 text-center">Loading eBook data...</div>;
  }

  const handleApply = (e) => {
    e.preventDefault();
    const success = onApplyCoupon(coupon);
    if (success) {
      setCouponApplied(true);
    } else {
      alert('Invalid coupon code');
    }
  };

  // Helper to fix base URL paths
  const getAssetPath = (path) => {
    const base = import.meta.env.BASE_URL;
    if (path.startsWith('http')) return path;
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return cleanBase + cleanPath;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b py-4 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <img src={getAssetPath("assets/revivex_logo.jpg")} alt="ReviveX Digital" className="h-10" />
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <a href="#learn" className="hover:text-revivex-red transition-colors">What You'll Learn</a>
            <a href="#checkout" className="hover:text-revivex-red transition-colors">Get Started</a>
          </div>
        </div>
      </nav>

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
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-revivex-black bg-gray-300"></div>
                  ))}
                </div>
                <p className="text-sm font-medium">Joined by 1,200+ business owners</p>
              </div>
              <a href="#checkout" className="bg-revivex-red text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
                Get Your Copy Now <ArrowRight size={20} />
              </a>
            </div>
          </div>
          <div className="w-64 md:w-80 flex-shrink-0 shadow-2xl rounded-lg overflow-hidden transform md:rotate-3">
            <img src={getAssetPath(ebook.coverImage)} alt={ebook.title} className="w-full h-auto" />
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <div className="bg-gray-50 py-8 border-b">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
          <div className="flex items-center gap-2 font-bold text-xl italic">ReviveX AI</div>
          <div className="flex items-center gap-2 font-bold text-xl italic">GHL PARTNER</div>
          <div className="flex items-center gap-2 font-bold text-xl italic">SA TECH</div>
          <div className="flex items-center gap-2 font-bold text-xl italic">SME FOCUS</div>
        </div>
      </div>

      {/* Content Section */}
      <main id="learn" className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-revivex-black">What's Inside the Guide?</h2>
            <div className="space-y-4">
              {ebook.learnings && ebook.learnings.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <CheckCircle className="text-green-500 flex-shrink-0" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="text-2xl font-bold mb-4">Why we wrote this:</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We've seen too many South African service businesses work twice as hard for half the results, simply because their lead management is "leaky".
            </p>
            <p className="text-gray-600 leading-relaxed">
              This guide isn't just theory—it's the exact blueprint we use to deploy AI agents that reclaim lost revenue in 24 hours.
            </p>
          </div>
        </div>
      </main>

      {/* Checkout Section */}
      <section id="checkout" className="py-20 px-4 bg-gray-50 border-y">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-5 border border-gray-100">
            <div className="md:col-span-2 bg-revivex-black p-8 text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Order Summary</h3>
                <p className="opacity-70 text-sm mb-6 font-medium uppercase tracking-wider">{ebook.title}</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-revivex-red" />
                    <span className="text-sm">Instant Digital PDF</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} className="text-revivex-red" />
                    <span className="text-sm">Secure Online Payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-revivex-red" />
                    <span className="text-sm">100% Satisfaction Guarantee</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-extrabold">{ebook.displayPrice}</span>
                  {ebook.originalPrice && (
                    <span className="text-xl opacity-50 line-through">{ebook.originalPrice}</span>
                  )}
                </div>
                <p className="text-xs opacity-60">One-time payment. No hidden fees.</p>
              </div>
            </div>
            
            <div className="md:col-span-3 p-8 md:p-12">
              <h4 className="text-xl font-bold mb-6">Complete Your Purchase</h4>
              
              {!couponApplied ? (
                <div className="mb-6">
                  {showCoupon ? (
                    <form onSubmit={handleApply} className="flex gap-2">
                      <input 
                        type="text" 
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Enter Code"
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-revivex-red outline-none"
                      />
                      <button className="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold">Apply</button>
                    </form>
                  ) : (
                    <button 
                      onClick={() => setShowCoupon(true)}
                      className="text-revivex-red text-sm font-bold flex items-center gap-1 hover:underline"
                    >
                      <Ticket size={14} /> Have a coupon code?
                    </button>
                  )}
                </div>
              ) : (
                <div className="mb-6 bg-green-50 text-green-700 p-3 rounded-lg text-sm font-bold flex items-center gap-2">
                  <CheckCircle size={16} /> Coupon Applied!
                </div>
              )}

              <div className="space-y-4">
                <div ref={paypalRef} className="min-h-[150px]"></div>
                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <ShieldCheck size={12} /> Securely processed by PayPal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <img src={getAssetPath("assets/revivex_logo.jpg")} alt="ReviveX Digital" className="h-8 mb-4 grayscale" />
            <p className="text-sm text-gray-500">© 2026 ReviveX Digital. Built in South Africa.</p>
          </div>
          <div className="flex gap-8">
            <a href="https://revivexdigital.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-revivex-red font-bold">Book an AI Demo</a>
            <a href="mailto:hello@revivexdigital.com" className="text-sm text-gray-500 hover:text-revivex-red font-bold">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
