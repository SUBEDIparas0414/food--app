import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { iconClass } from '../../assets/dummydata';

const inputBase = "w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

const Login = ({ onLoginSuccess, onClose }) => {

  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });

  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    formData.rememberMe
      ? localStorage.setItem('loginData', JSON.stringify(formData))
      : localStorage.removeItem('loginData');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    onLoginSuccess();
  };

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <div className='space-y-6 relative'>
      {/* Toast Message */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300
        ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
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
            type="text"
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
      </form>
    </div>
  )
}

export default Login;
