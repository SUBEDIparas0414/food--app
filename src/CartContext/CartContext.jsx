import React, { createContext, useContext } from 'react';

// 1. Create Context
const CartContext = createContext();

// 2. Provider Component
export const CartProvider = ({ children }) => {
  return (
    <CartContext.Provider value={{}}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Custom Hook
export const useCart = () => useContext(CartContext);
