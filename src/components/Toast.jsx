// src/components/Toast.jsx
import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'error' ? 'bg-red-500' : 'bg-[#2563e8]';

  return (
    <div
      className={`fixed top-4 right-4 ${bg} text-white px-4 py-2 rounded-[15px] shadow-lg flex items-center animate-fade-in z-[60]`}
    >
      {message}
    </div>
  );
};

export default Toast;
