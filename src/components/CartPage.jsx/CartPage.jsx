import React from 'react'
import { useCart } from '../../CartContext/CartContext';
import {Link} from 'react-router-dom';
impot

const CartPage = () => {
    const {cartItems,removeFromCart,updateQuantity,cartTotal} = useCart();
    const [selectedImage,setSelectedImage]= useState(null);
  return (
    <div className=''>
        <div className=''>
            <h1 className=''>
                <span className=''>
                    Your Cart
                </span>
            </h1>
            {cartItems.length === 0 ? (
                <div className=''>
                    <p className=''>
                        your cart is empty

                    </p>
                    <Link to='/menu' className=''>
                    Browser All items
                    </Link>
                </div>
            ):(
                <>
                <div className=''>
                    {cartItems.map((item)=>(
                        <div key={item.id} className=''>
                            <div className='' onClick={()=> setSelectedImage(item.image)}>
                                <img src={item.image} alt={item.name} className='' />

                            </div>
                        </div>
                    ))}
                </div>
                </>
            )}
        </div>
      
    </div>
  )
}

export default CartPage
