import React, { useState } from "react";
import {
  addButtonBase,
  addButtonHover,
  additionalData,
  cardData,
  commonTransition,
} from "../../assets/dummydata";
import { useCart } from "../../CartContext/CartContext";
import { FaFire, FaHeart, FaPlus, FaStar } from "react-icons/fa";
import { HiMinus, HiPlus } from "react-icons/hi";
import FloatingParticle from "../FloatingParticle/FloatingParticle";

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const initialData = [...cardData, ...additionalData];
  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();

  return (
    <div className="bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4 font-[poppins]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold capitalize tracking-wide">
            today's <span className="text-yellow-400 drop-shadow">Special</span> Offers
          </h1>
          <p className="text-gray-300 mt-2 max-w-xl mx-auto">
            Savor the extraordinary with our culinary masterpieces crafted to perfection
          </p>
        </div>

        {/* product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {(showAll ? initialData : initialData.slice(0, 4)).map((item, index) => {
            const cartItem = cartItems.find((ci) => ci.id === item.id);
            const quantity = cartItem?.quantity || 0;

            return (
              <div
                key={`${item.id}-${index}`}
                className="bg-[#1f1f1f] rounded-xl overflow-hidden shadow-md hover:shadow-yellow-500/20 transition-all duration-300"
              >
                <div className="relative h-72 overflow-hidden group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded text-xs flex items-center gap-1 text-amber-400">
                    <FaStar className="text-sm" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded text-xs flex items-center gap-1 text-red-400">
                    <FaHeart className="text-sm" />
                    <span className="font-semibold">{item.hearts}</span>
                  </div>
                </div>

                <div className="p-6 relative z-10 space-y-3">
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xl font-bold text-amber-400 flex-1">
                      {item.price}
                    </span>

                    {quantity > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            quantity > 1
                              ? updateQuantity(item.id, quantity - 1)
                              : removeFromCart(item.id)
                          }
                          className="w-8 h-8 rounded-full bg-amber-800/40 hover:bg-amber-700/60 text-white flex items-center justify-center transition"
                        >
                          <HiMinus />
                        </button>

                        <span className="w-8 text-center text-amber-100 font-semibold">
                          {quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, quantity + 1)}
                          className="w-8 h-8 rounded-full bg-amber-800/40 hover:bg-amber-700/60 text-white flex items-center justify-center transition"
                        >
                          <HiPlus />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addToCart(
                            {
                              ...item,
                              name: item.title,
                              price: parseFloat(item.price.replace("₹", "")),
                            },
                            1
                          )
                        }
                        className={`${addButtonBase} ${addButtonHover} ${commonTransition} flex items-center gap-2 text-sm px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-400 text-black font-medium`}
                      >
                        <FaPlus />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3">
                  <div className="rounded-lg overflow-hidden">
                    <FloatingParticle />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-semibold rounded-full shadow-md hover:bg-yellow-400 transition"
          >
            <FaFire className="animate-pulse" />
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
