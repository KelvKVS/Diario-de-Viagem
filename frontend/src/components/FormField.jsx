import React from 'react';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  error,
  className = '',
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-3 border ${
              error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 transition-colors ${className}`}
            {...props}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full p-3 border ${
              error ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
            } rounded-lg focus:outline-none focus:ring-2 transition-colors ${className}`}
            {...props}
          />
        )}
        {error && (
          <div className="absolute -bottom-6 left-0 text-sm text-red-500">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormField; 