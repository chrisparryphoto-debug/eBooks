import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CartPage from './pages/CartPage';
import { trackClick } from './utils/analytics';
import { EBOOKS } from './data/ebooks';

function App() {
  console.log("App starting...");
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EBookWrapper />} />
        <Route path="/ebook/:slug" element={<EBookWrapper />} />
        <Route path="/cart" element={<CartPage />} />
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">eBook not found.</h2>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Launch Promo Prices
  const promoPrices = {
    'missed-call': 97,
    'dead-leads': 97,
    'speed-wins': 97,
    'engagement-wins': 97,
    'ai-bundle': 297
  };

  let currentPrice = 0;
  let originalPriceNum = 0;
  try {
    const originalPriceStr = ebook.price || "R197";
    originalPriceNum = parseInt(originalPriceStr.replace('R', '')) || 197;
    const launchPrice = promoPrices[currentSlug] || originalPriceNum;
    currentPrice = Math.max(0, launchPrice - discount);
  } catch (e) {
    console.error("Price calculation error", e);
    currentPrice = 97; // Fallback
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
        originalPrice: (currentPrice < originalPriceNum) ? `R${originalPriceNum}` : null,
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
  const purchasedSlugs = location.state?.purchasedSlugs || [location.state?.ebookSlug || 'missed-call'];
  const purchasedEbooks = purchasedSlugs.map(slug => EBOOKS[slug]).filter(Boolean);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (purchasedEbooks.length === 0) return <Navigate to="/" replace />;

  const handleDownload = (title) => {
    trackClick('eBook Download', { ebook: title });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-8 border-green-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your eBook{purchasedEbooks.length > 1 ? 's are' : ' is'} ready for download below.
        </p>
        
        <div className="space-y-4 mb-8">
          {purchasedEbooks.map((ebook) => (
            <div key={ebook.slug} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-left">
              <div className="w-16 h-20 bg-slate-200 rounded overflow-hidden shrink-0">
                <img src={ebook.coverImage} alt={ebook.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-2">{ebook.title}</h3>
                <a
                  href={'/' + ebook.pdfPath}
                  download
                  onClick={() => handleDownload(ebook.title)}
                  className="inline-flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Download PDF
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-8 mt-8">
          <p className="text-sm text-gray-500 mb-4">Want to supercharge your business with the tools we mentioned?</p>
          <a
            href="https://www.gohighlevel.com/?fp_ref=06ogd"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors mb-2"
          >
            Get a 14-Day Free Trial of GoHighLevel
          </a>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-8 text-gray-500 hover:text-red-600 text-sm font-medium"
        >
          &larr; Back to Main
        </button>
      </div>
    </div>
  );
};

export default App;
