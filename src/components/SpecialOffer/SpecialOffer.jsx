import React, { useState } from 'react'
import { additionalData, cardData } from '../../assets/dummydata'
import { useCart } from '../../CartContext/CartContext';

const SpecialOffer = () => {
    const [showAll,setShowAll] = useState(false)
    const initialData = [...cardData,...additionalData];
    const [addToCart,updateQuantity,removeFromCart,cartItems] = useCart();
  return (
    <div className=' bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4 font-[poppins]'>
        <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-14'>
                <h1 className=''>
                    today's <span className='text-stroke-gold'>Special</span>Offers
                </h1>
                <p className=''>
                    Savor the extraordinary with our culinary masterpieces crafted to perfection
                </p>

            </div>
            {/* product card */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
                {(showAll ? initialData : initialData.slice(0,4)).map((item,index)=>{
                    const cartItem = cartItems.find(ci =>ci.id===item.id);
                    const quantity = cartItem ? cartItem.quantity :0;
                    return (
                        <div key = {`${item.id}-${index}`} className=''>
                            <div className=' relative h-72 overflow-hidden'>
                                <img src={item.image} alt={item.title}  className='' />

                            </div>
                        </div>
                    )

                })}

            </div>
        </div>
      
    </div>
  )
}

export default SpecialOffer
