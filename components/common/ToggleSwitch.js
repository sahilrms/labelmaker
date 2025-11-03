// components/common/ToggleSwitch.js
import React from 'react';

const ToggleSwitch = ({
  options,
  selected,
  onToggle,
  className = '',
  activeClass = 'text-white font-semibold',
  inactiveClass = 'text-gray-600 hover:text-gray-800',
}) => {
  const selectedIndex = options.findIndex(option => option.value === selected);
  const widthPercentage = 100 / options.length;

  return (
    <div
      className={`relative flex items-center bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full p-1 shadow-inner ${className}`}
    >
      {/* Sliding background indicator */}
      <div
        className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out shadow-md"
        style={{
          width: `${widthPercentage}%`,
          left: `${selectedIndex * widthPercentage}%`,
          background:
            'linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(37,99,235,1) 100%)',
          boxShadow:
            '0 2px 6px rgba(59,130,246,0.4), 0 0 8px rgba(37,99,235,0.3)',
        }}
        aria-hidden="true"
      />

      {/* Options */}
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          className={`relative flex-1 text-center px-4 py-2 rounded-full text-sm transition-all duration-200 ease-in-out z-10 ${
            selected === option.value ? activeClass : inactiveClass
          }`}
          onClick={() => onToggle(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleSwitch;
