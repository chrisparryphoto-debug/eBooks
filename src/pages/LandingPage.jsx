import React, { useState, useEffect, useRef } from 'react';

const LandingPage = ({ ebook, onCheckout, onApplyCoupon }) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalRef = useRef();

  useEffect(() => {
    if (!ebook) return;
    console.log("LandingPage useEffect: loading PayPal...");

    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=USD";
    script.async = true;
    script.onload = () => {
      console.log("PayPal SDK loaded.");
      setPaypalLoaded(true);
    };
    script.onerror = (e) => {
      console.error("Failed to load PayPal SDK", e);
    };
    document.body.appendChild(script);
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
                amount: { currency_code: 'USD', value: usdAmount }
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

  if (!ebook) return <div>Loading...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{ebook.title}</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>{ebook.tagline}</p>
      </header>

      <main style={{ background: '#f9f9f9', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2>Order Summary</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
          <span>{ebook.title}</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{ebook.displayPrice}</span>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h3>Complete Purchase</h3>
          {!paypalLoaded ? <p>Connecting to PayPal...</p> : <div ref={paypalRef}></div>}
        </div>
      </main>
      
      <footer style={{ marginTop: '50px', textAlign: 'center', color: '#999', fontSize: '0.8rem' }}>
        &copy; 2026 ReviveX Digital. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
