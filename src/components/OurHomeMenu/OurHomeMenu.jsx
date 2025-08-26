import React, { useEffect, useState } from 'react';
import { useCart } from '../../CartContext/CartContext';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian', 'Drinks'];

const OurHomeMenu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  const [menuData, setMenuData] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:4000/api/items')
      .then((res) => {
        const grouped = res.data.reduce((acc, item) => {
          acc[item.category] = acc[item.category] || [];
          acc[item.category].push(item);
          return acc;
        }, {});
        setMenuData(grouped);
      })
      .catch(console.error);
  }, []);

  // find cart entry by item id
  const getCartEntry = (id) => cartItems.find((ci) => ci.item._id === id);
  const getQuantity = (id) => getCartEntry(id)?.quantity || 0;

  const displayItems = (menuData[activeCategory] || []).slice(0, 4);

  return (
    <div className="bg-[#1e1e1e] text-white px-4 py-16 font-[poppins]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">
            <span className="text-yellow-400">Our Exclusive Menu</span>
          </h2>
          <p className="text-gray-300 text-sm sm:text-base">A symphony of Flavours</p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition duration-200 ${
                activeCategory === cat
                  ? 'bg-yellow-400 text-black shadow'
                  : 'bg-gray-700 text-white hover:bg-yellow-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayItems.map((item, i) => {
            const qty = getQuantity(item._id);
            const cartEntry = getCartEntry(item._id);

            return (
              <div
                key={item._id}
                className="bg-[#2a2a2a] rounded-xl shadow-lg overflow-hidden flex flex-col"
                style={{ '--index': i }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-yellow-400 font-bold text-lg">Rs: {item.price}</span>

                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <>
                          <button
                            className="bg-yellow-500 hover:bg-yellow-400 text-black w-8 h-8 flex items-center justify-center rounded-full"
                            onClick={() =>
                              qty > 1
                                ? updateQuantity(cartEntry.item._id, qty - 1)
                                : removeFromCart(cartEntry.item._id)
                            }
                          >
                            <FaMinus />
                          </button>

                          <span className="px-2 text-sm">{qty}</span>

                          <button
                            className="bg-yellow-500 hover:bg-yellow-400 text-black w-8 h-8 flex items-center justify-center rounded-full"
                            onClick={() => updateQuantity(cartEntry.item._id, qty + 1)}
                          >
                            <FaPlus />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => addToCart(item, 1)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1 text-sm rounded-full font-medium"
                        >
                          Add To Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore Full Menu Link */}
        <div className="flex justify-center mt-16">
          <Link
            className="text-yellow-400 font-semibold hover:underline hover:text-yellow-300 transition"
            to="/menu"
          >
            Explore Full Menu →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OurHomeMenu;
