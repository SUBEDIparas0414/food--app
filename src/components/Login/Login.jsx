import React, { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUserPlus
} from 'react-icons/fa';
import { iconClass, inputBase } from '../../assets/dummydata';
import { Link } from 'react-router-dom';

const Login = ({ onLoginSuccess, onClose }) => {
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.rememberMe
      ? localStorage.setItem('loginData', JSON.stringify(formData))
      : localStorage.removeItem('loginData');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    onLoginSuccess();
  };

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className='space-y-6 relative'>
      {/* Toast Message */}
      <div
        className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
          showToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'
        }`}
      >
        <div className='bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm'>
          <FaCheckCircle className='flex-shrink-0' />
          <span> Login Successfully</span>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Username Field */}
        <div className='relative'>
          <FaUser className={iconClass} />
          <input
            type='text'
            name='username'
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-4 py-3`}
          />
        </div>

        {/* Password Field */}
        <div className='relative'>
          <FaLock className={iconClass} />
          <input
            type={showPassword ? 'text' : 'password'}
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
            className={`${inputBase} pl-10 pr-10 py-3`}
          />
          <button
            type='button'
            onClick={toggleShowPassword}
            className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500'
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Remember Me */}
        <div className='flex items-center'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              name='rememberMe'
              checked={formData.rememberMe}
              onChange={handleChange}
              className='form-checkbox h-5 w-5 text-amber-600 bg-[#2D1B0E] border-amber-400 rounded focus:ring-amber-600'
            />
            <span className='ml-2'>Remember me</span>
          </label>
        </div>

        {/* Sign In Button */}
        <button
          type='submit'
          className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md flex items-center justify-center gap-2 transition'
        >
          Sign In <FaArrowRight />
        </button>
      </form>

      {/* Signup Link */}
      <div className='text-center'>
        <Link to='/signup' onClick={onClose} className='text-blue-600 hover:underline flex items-center justify-center gap-2'>
          <FaUserPlus /> Create new Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
