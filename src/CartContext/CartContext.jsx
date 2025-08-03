import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useMemo,
} from 'react';

// 1. Create Context
const CartContext = createContext();

// Reducer: handles add, remove, and quantity update
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, quantity } = action.payload;
      const existingItem = state.find((i) => i.id === item.id);
      if (existingItem) {
        return state.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...state, { ...item, quantity }];
    }

    case 'REMOVE_ITEM': {
      return state.filter((i) => i.id !== action.payload.itemId);
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, newQuantity } = action.payload;
      return state.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(1, newQuantity) } : i
      );
    }

    default:
      return state;
  }
};

// 2. Initialize cart from localStorage
const initializer = () => {
  if (typeof window !== 'undefined') {
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : [];
  }
  return [];
};

// 3. Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Memoized totals
  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const totalItemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const formatTotalItems = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  // Actions
  const addToCart = useCallback((item, quantity) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, quantity } });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, newQuantity } });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        totalItems: formatTotalItems(totalItemCount),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom Hook
export const useCart = () => useContext(CartContext);
