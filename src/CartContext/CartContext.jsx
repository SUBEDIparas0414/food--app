import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

// 1. Create Context
const CartContext = createContext();

//reducer handling card action like add remove update and quantity
const cartReducer =(state,action) =>{
  switch(action.type){
    case 'ADD_ITEM': {
      const {item,quantity} = action.payload;
      const existingItem = state.find(i => i.id === item.id);
      if(existingItem){
        return state.map(i => i.id === item.id ? {...i,quantity}:i)
      }
      return [...state,{...item,quantity}];

    }
    case 'REMOVE_ITEM':{
      return state.filter(i => i.id !== action.payload.itemId);
    }
    case 'UPDATE_QUANTITY':{
      const { itemId,newQuantity} = action.payload;
      return state.map(i => i.id === itemId ? {...i,quantity:Math.max(1,newQuantity)}:i)
    }
    default: return state;
  }
}

//initialize cart from  the local storage

const initializer =()=>{
  if(typeof window !== 'undefined'){
    const localCart = localStorage.getItem('cart');
    return localCart ? JSON.parse(localCart) : []
  }
  return [];

}

// 2. Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems,dispatch] = useReducer(cartReducer,[],initializer);

  //PRESIST CART STATE TO LOCALSTORAGE

  useEffect(()=>{
    localStorage.setItem('/cart',JSON.stringify(cartItems));
  },[cartItems]);
  //calculate total cost and total items count

  const cartTotal = cartItems.reduce((total,item)=>total + cartItems.price * item.quantity,0);
  const totalItemscount = cartItems.reduce((sum,item)=> sum + item.quantity,0);

  //format total items in power form

  const formatTotalItems =(num)=>{
    if(num>=1000){
      return (num/1000).toFixed(1) + 'k'
    }
    return num;
  }

  //dispatcher wrapped with callback for performance 
  const addTOCart = useCallback((item,quantity)=>{
    dispatch({type:'ADD_ITEM',payload:{item,quantity}})
  },[])
  const removeFromCart = useCallback((itemId)=>{
    dispatch({type:'REMOVE_ITEM',payload:{itemId}})
  },[])
  const updateQuantity = useCallback((itemId,newQuantity)=>{
    dispatch({type:'UPDATE_QUANTITY',payload:{itemId,newQuantity}})
  },[])
  return (
    <CartContext.Provider value={{
      cartItems,addTOCart,removeFromCart,updateQuantity,cartTotal,
      totalItems:formatTotalItems(totalItemscount),

      
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Custom Hook
export const useCart = () => useContext(CartContext);
