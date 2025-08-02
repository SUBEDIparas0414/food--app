import React, { useEffect, useState } from "react";
import { GiChefToque, GiKnifeFork } from "react-icons/gi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiStar,
  FiPhone,
  FiShoppingCart,
  FiLogOut,
  FiKey,
} from "react-icons/fi";
import { useCart } from "../../CartContext/CartContext";
import Login from "../Login/Login";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [showLoginModel, setShowLoginModel] = useState(false); // ✅ FIXED
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("loginData"))
  );

  useEffect(() => {
    setShowLoginModel(location.pathname === "/login");
    setIsAuthenticated(Boolean(localStorage.getItem("loginData")));
  }, [location.pathname]);

  const handleLoginSuccess = () => {
    localStorage.setItem("loginData", JSON.stringify({ loggedIn: true }));
    setIsAuthenticated(true);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setIsAuthenticated(false);
  };

  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-transparent text-amber-100 hover:text-amber-300 hover:border-amber-600 transition"
      >
        <FiLogOut className="text-lg" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-transparent text-amber-100 hover:text-amber-300 hover:border-amber-600 transition"
      >
        <FiKey className="text-lg" />
        <span>Login</span>
      </button>
    );
  };

  const renderMobileAuthButton = () => {
    return isAuthenticated ? (
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-amber-900/30 text-amber-100 hover:border-amber-600/50 transition"
      >
        <FiLogOut className="text-lg text-amber-500" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        onClick={() => {
          navigate("/login");
          setIsOpen(false);
        }}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-amber-900/30 text-amber-100 hover:border-amber-600/50 transition"
      >
        <FiKey className="text-lg text-amber-500" />
        <span>Login</span>
      </button>
    );
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <FiHome /> },
    { name: "Menu", href: "/menu", icon: <FiBook /> },
    { name: "About", href: "/about", icon: <FiStar /> },
    { name: "Contact", href: "/contact", icon: <FiPhone /> },
  ];

  return (
    <nav className="bg-[#1f120a] border-b-4 border-amber-800/50 sticky top-0 z-50 shadow-md font-vibes">
      {/* Decorative Top Bar */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 z-10">
        <div className="h-[4px] rounded-full bg-gradient-to-r from-transparent via-amber-400/50 to-transparent shadow-sm" />
        <div className="flex justify-between px-6">
          <GiKnifeFork className="text-amber-400/30 -mt-3 rotate-45 animate-pulse" size={26} />
          <GiKnifeFork className="text-amber-400/30 -mt-3 rotate-45 animate-pulse" size={26} />
        </div>
      </div>

      {/* Main Navbar Content */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <GiChefToque className="text-3xl text-amber-400 hover:text-amber-300 transition duration-300" />
            <div className="ml-1">
              <NavLink
                to="/"
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent font-monsieur"
              >
                TrioOrder
              </NavLink>
              <div className="h-[2px] bg-amber-400/40 w-full mt-1" />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm px-4 py-2 rounded-xl border-2 transition-all duration-300
                  ${
                    isActive
                      ? "border-amber-500 bg-amber-900/20 text-amber-300"
                      : "border-transparent text-amber-100 hover:text-amber-300 hover:border-amber-600"
                  }`
                }
              >
                {link.icon}
                <span>{link.name}</span>
              </NavLink>
            ))}

            {/* Cart Icon */}
            <NavLink
              to="/cart"
              className="relative flex items-center px-3 py-2 border-2 rounded-xl border-amber-900/30 hover:border-amber-600 transition-all text-amber-100 hover:text-amber-300"
            >
              <FiShoppingCart className="text-lg" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </NavLink>

            {renderDesktopAuthButton()}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-md border border-amber-900/40 hover:border-amber-500 text-amber-400 hover:text-amber-300 transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <span
                  className={`block h-[2px] w-6 bg-current transform transition ${
                    isOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-current transition ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-[2px] w-6 bg-current transform transition ${
                    isOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#2D1B0E] border-t-4 border-amber-900/40 relative shadow-lg w-full">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all border-2
                  ${
                    isActive
                      ? "bg-amber-600/30 text-amber-100 border-amber-600/50"
                      : "border-amber-900/30 text-amber-100 hover:border-amber-600/50"
                  }`
                }
              >
                <span className="text-amber-500 text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}

            <div className="pt-4 border-t-2 border-amber-900/30 space-y-2">
              <NavLink
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 text-amber-100 rounded-xl border-2 border-amber-900/30 hover:border-amber-600/50 flex items-center justify-between text-sm relative"
              >
                <div className="flex items-center gap-2">
                  <FiShoppingCart className="text-lg text-amber-500" />
                  <span>Cart</span>
                </div>
                {totalItems > 0 && (
                  <span className="bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </NavLink>
              {renderMobileAuthButton()}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1f120a] rounded-xl shadow-xl p-6 w-full max-w-md relative text-amber-100">
            <button
              onClick={() => navigate("/")}
              className="absolute top-3 right-4 text-2xl hover:text-amber-400 transition"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-center">TrioOrder Login</h2>
            <Login onLoginSuccess={handleLoginSuccess} onClose={() => navigate("/")} />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
