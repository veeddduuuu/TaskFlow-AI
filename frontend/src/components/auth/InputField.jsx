import React from 'react';

const InputField = ({ label, type = 'text', name, value, onChange, placeholder, required = true, error }) => {
  return (
    <div className="w-full space-y-1.5 focus-within:text-brand-400 text-gray-400 transition-colors">
      <label className="text-sm font-medium pl-1 text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 bg-dark-card border rounded-xl outline-hidden focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all text-white placeholder-gray-500 ${
          error ? 'border-red-500' : 'border-dark-border'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1 pl-1">{error}</p>}
    </div>
  );
};

export default InputField;
