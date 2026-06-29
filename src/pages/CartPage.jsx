import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';

const CartPage = () => {
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalRef = useRef();
  const navigate = useNavigate();

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
    if (paypalLoaded && window.paypal && paypalRef.current && cartItems.length > 0) {
      try {
        paypalRef.current.innerHTML = '';
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            const usdAmount = (cartTotal / 19).toFixed(2);
            return actions.order.create({
              purchase_units: [{
                description: `Purchase of ${cartItems.length} eBooks`,
                amount: { currency_code: 'USD', value: usdAmount },
                payee: { email_address: 'chrisparryphoto@gmail.com' }
              }],
            });
          },
          onApprove: async (data, actions) => {
            await actions.order.capture();
            // Store the slugs of purchased items in state for the success page
            const slugs = cartItems.map(item => item.slug);
            clearCart();
            navigate('/success', { state: { purchasedSlugs: slugs, paidPrice: cartTotal } });
          },
          style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'buy' }
        }).render(paypalRef.current);
      } catch (err) {
        console.error("PayPal Button Render Error:", err);
      }
    }
  }, [paypalLoaded, cartTotal, cartItems.length]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-xl text-center border border-slate-200">
            <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't added any eBooks yet.</p>
            <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold inline-block transition">
              Browse eBooks
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.slug} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-6 items-center">
                  <div className="w-20 h-28 bg-slate-100 rounded-lg overflow-hidden shrink-0 shadow-inner">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-red-600 font-bold">{item.displayPrice}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.slug)}
                    className="p-2 text-slate-400 hover:text-red-600 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
              
              <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-red-600 transition font-medium text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Add more eBooks
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 h-fit sticky top-24">
              <h3 className="text-xl font-bold mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>R{cartTotal}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-slate-100 pt-4">
                  <span>Total:</span>
                  <span>R{cartTotal}</span>
                </div>
                <p className="text-[10px] text-slate-400 italic">Approx. ${(cartTotal / 19).toFixed(2)} USD for processing</p>
              </div>
              
              <div className="min-h-[150px] flex flex-col justify-center">
                {!paypalLoaded ? (
                  <div className="flex flex-col items-center gap-4 py-8">
                    <div className="animate-spin rounded-full h-8 w-12 border-b-2 border-red-600"></div>
                    <p className="text-slate-400 text-xs">Loading payment options...</p>
                  </div>
                ) : (
                  <div ref={paypalRef} className="w-full"></div>
                )}
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-4 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-4" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
