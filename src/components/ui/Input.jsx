import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = '',
  required = false,
  rightElement,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold tracking-widest text-gray-500 uppercase"
        >
          {label}
          {required && <span className="text-indigo-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-lg border
            text-sm text-gray-800 placeholder-gray-400
            bg-white outline-none
            transition-all duration-200
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-gray-200'}
            ${rightElement ? 'pr-12' : ''}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
