// Utility for tracking events
export const trackClick = (eventName, properties = {}) => {
  console.log(`[Tracking] ${eventName}:`, properties);
  
  // In production, you would call your analytics service here:
  // if (window.gtag) {
  //   window.gtag('event', eventName, properties);
  // }
  
  // Or send to a custom backend for affiliate conversion tracking:
  // fetch('/api/track', {
  //   method: 'POST',
  //   body: JSON.stringify({ eventName, ...properties, timestamp: new Date() })
  // });
};
