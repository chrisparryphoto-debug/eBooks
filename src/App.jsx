import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import { trackClick } from './utils/analytics';
import { EBOOKS } from './data/ebooks';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route shows the first eBook */}
        <Route path="/" element={<Navigate to="/ebook/missed-call" replace />} />
        
        {/* Dynamic eBook routes */}
        <Route path="/ebook/:slug" element={<EBookWrapper />} />
        
        {/* Success page */}
        <Route path="/success" element={<SuccessPage />} />

        {/* Catch-all redirect */}
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

  const ebook = EBOOKS[slug || 'missed-call'];

  if (!ebook) {
    return <Navigate to="/" replace />;
  }

  // Launch Promo Prices (aligned with Content Writer/Designer)
  const promoPrices = {
    'missed-call': 97,
    'dead-leads': 97,
    'speed-wins': 97,
    'engagement-wins': 97,
    'ai-bundle': 297
  };

  const isEBook1 = ebook.slug === 'missed-call';
  const originalPriceStr = ebook.price;
  const originalPriceNum = parseInt(originalPriceStr.replace('R', ''));
  const launchPrice = promoPrices[ebook.slug] || originalPriceNum;
  
  // Current price after promo and coupon
  const currentPrice = Math.max(0, launchPrice - discount);

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

  const handleCheckout = () => {
    trackClick('Initiate Checkout', { 
      ebook: ebook.title, 
      slug: ebook.slug,
      price: currentPrice,
      coupon: discount > 0 ? couponCode : 'none'
    });
    // In a real app, this would redirect to Stripe/PayFast Checkout
    console.log(`Proceeding to checkout for ${ebook.title} at R${currentPrice}...`);
    
    // Mocking success redirect with state
    navigate('/success', { state: { ebookSlug: ebook.slug, paidPrice: currentPrice } });
  };

  return (
    <LandingPage 
      ebook={{
        ...ebook, 
        displayPrice: `R${currentPrice}`, 
        // Show original price if we are in promo or a coupon is applied
        originalPrice: (currentPrice < originalPriceNum) ? originalPriceStr : null,
        isPromo: isEBook1 // Banner only for eBook 1 as per task "promo for eBook 1 (first 50)"
      }} 
      onCheckout={handleCheckout} 
      onApplyCoupon={handleApplyCoupon}
    />
  );
};

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ebookSlug = location.state?.ebookSlug || 'missed-call';
  const paidPrice = location.state?.paidPrice;
  const ebook = EBOOKS[ebookSlug];

  if (!ebook) return <Navigate to="/" replace />;

  // Track GHL affiliate click
  const handleGHLClick = () => {
    trackClick('GHL Affiliate Click', { source: 'Success Page', ebook: ebook.title });
  };

  const handleDownload = () => {
    trackClick('eBook Download', { ebook: ebook.title });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-8 border-green-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for purchasing <strong>{ebook.title}</strong>. Your eBook is ready for download below.
        </p>

        <a 
          href={ebook.pdfPath} 
          download
          onClick={handleDownload}
          className="block w-full bg-revivex-red text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download eBook (PDF)
        </a>

        <div className="border-t pt-8 mt-8">
          <p className="text-sm text-gray-500 mb-4">Want to supercharge your business with the tools we mentioned?</p>
          <a 
            href="https://www.gohighlevel.com/?fp_ref=revivex" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleGHLClick}
            className="block w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors mb-2"
          >
            Get a 14-Day Free Trial of GoHighLevel
          </a>
          <p className="text-xs text-gray-400 italic">Affiliate Link: Helps support our educational content!</p>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-sm text-gray-600 mb-4">Interested in more AI strategies?</p>
          <div className="flex flex-col gap-2">
            {Object.values(EBOOKS).filter(e => e.slug !== ebookSlug).map(otherEbook => (
              <button 
                key={otherEbook.slug}
                onClick={() => navigate(`/ebook/${otherEbook.slug}`)}
                className="text-revivex-black hover:text-revivex-red text-sm font-medium transition-colors"
              >
                Check out: {otherEbook.title} &rarr;
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="mt-8 text-gray-500 hover:text-revivex-red text-sm font-medium"
        >
          &larr; Back to Main
        </button>
      </div>
    </div>
  );
};

export default App;
