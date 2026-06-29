import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (ebook) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((item) => item.slug === ebook.slug);
      if (exists) return prevItems; // Don't add duplicate eBooks
      return [...prevItems, ebook];
    });
  };

  const removeFromCart = (slug) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.slug !== slug));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = parseInt(item.displayPrice.replace('R', '')) || 0;
    return total + price;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
