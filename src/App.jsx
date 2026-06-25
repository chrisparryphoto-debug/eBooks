import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { trackClick } from './utils/analytics';
import { EBOOKS } from './data/ebooks';

function App() {
  console.log("App starting...");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EBookWrapper />} />
        <Route path="/ebook/:slug" element={<EBookWrapper />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

const EBookWrapper = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const currentSlug = slug || 'missed-call';
  const ebook = EBOOKS[currentSlug];

  console.log("EBookWrapper slug:", currentSlug);

  if (!ebook) {
    return <div>EBook not found. <button onClick={() => navigate('/')}>Go Home</button></div>;
  }

  const promoPrices = {
    'missed-call': 97,
    'dead-leads': 97,
    'speed-wins': 97,
    'engagement-wins': 97,
    'ai-bundle': 297
  };

  let currentPrice = 0;
  try {
    const originalPriceStr = ebook.price || "R0";
    const originalPriceNum = parseInt(originalPriceStr.replace('R', '')) || 0;
    const launchPrice = promoPrices[currentSlug] || originalPriceNum;
    currentPrice = Math.max(0, launchPrice - discount);
  } catch (e) {
    console.error("Price calculation error", e);
  }

  const handleApplyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    setCouponCode(cleanCode);
    if (cleanCode === 'LAUNCH50') {
      setDiscount(50);
      return true;
    }
    setDiscount(0);
    return false;
  };

  const handlePaymentSuccess = () => {
    trackClick('Payment Success', { 
      ebook: ebook.title, 
      slug: currentSlug,
      price: currentPrice,
      coupon: discount > 0 ? couponCode : 'none'
    });
    navigate('/success', { state: { ebookSlug: currentSlug, paidPrice: currentPrice } });
  };

  return (
    <LandingPage 
      ebook={{
        ...ebook, 
        displayPrice: `R${currentPrice}`, 
        originalPrice: ebook.price,
        isPromo: true
      }} 
      onCheckout={handlePaymentSuccess} 
      onApplyCoupon={handleApplyCoupon}
    />
  );
};

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ebookSlug = location.state?.ebookSlug || 'missed-call';
  const ebook = EBOOKS[ebookSlug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!ebook) return <Navigate to="/" replace />;

  return (
    <div className="p-20 text-center">
      <h1>Success!</h1>
      <p>Thank you for buying {ebook.title}</p>
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
};

export default App;
