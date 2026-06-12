import React, { useState, useEffect, useRef } from 'react';

const LandingPage = ({ ebook, onCheckout, onApplyCoupon }) => {
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalRef = useRef();

  useEffect(() => {
    if (!ebook) return;

    const loadPayPal = () => {
      if (window.paypal) {
        setPaypalLoaded(true);
        return;
      }

      console.log("Loading PayPal SDK dynamically...");
      const script = document.createElement('script');
      script.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=USD";
      script.async = true;
      script.onload = () => {
        console.log("PayPal SDK loaded.");
        setPaypalLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load PayPal SDK.");
      };
      document.body.appendChild(script);
    };

    loadPayPal();
  }, []);

  useEffect(() => {
    if (paypalLoaded && window.paypal && paypalRef.current) {
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
    }
  }, [paypalLoaded, ebook?.displayPrice]);

  if (!ebook) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading...</div>;
  }

  const handleApply = (e) => {
    e.preventDefault();
    if (onApplyCoupon(coupon)) setCouponApplied(true);
    else alert('Invalid coupon code');
  };

  const getAssetPath = (path) => {
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return cleanBase + cleanPath;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="bg-white border-b py-4 px-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="font-bold text-xl text-revivex-red">ReviveX Digital</div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
            <a href="#learn">Learn</a>
            <a href="#checkout">Buy Now</a>
          </div>
        </div>
      </nav>

      <header className="bg-revivex-black text-white py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">{ebook.title}</h1>
            <p className="text-xl mb-8 opacity-90">{ebook.tagline}</p>
            <a href="#checkout" className="bg-revivex-red text-white px-8 py-4 rounded-xl font-bold text-lg inline-block">
              Get Your Copy Now &rarr;
            </a>
          </div>
          <div className="w-64 md:w-80 shadow-2xl rounded-lg overflow-hidden">
            <img src={getAssetPath(ebook.coverImage)} alt={ebook.title} className="w-full h-auto" />
          </div>
        </div>
      </header>

      <main id="learn" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">What's Inside?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <ul className="space-y-4">
            {ebook.learnings && ebook.learnings.map((item, i) => (
              <li key={i} className="flex gap-2">✅ <span>{item}</span></li>
            ))}
          </ul>
        </div>
      </main>

      <section id="checkout" className="py-20 px-4 bg-gray-50 border-y">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-5">
          <div className="md:col-span-2 bg-revivex-black p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Order Summary</h3>
            <p className="text-4xl font-extrabold mb-2">{ebook.displayPrice}</p>
            <p className="text-sm opacity-60">One-time payment.</p>
          </div>
          <div className="md:col-span-3 p-8">
            <h4 className="text-xl font-bold mb-6">Complete Purchase</h4>
            <div className="space-y-4">
              {!paypalLoaded ? <div>Connecting to PayPal...</div> : <div ref={paypalRef}></div>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
