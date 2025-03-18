'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Digit = ({ position, value, prevValue, isDecimal, isComma }) => {
  const slideVariants = {
    enter: { y: -100, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  };

  return (
    <div className={`relative ${isComma ? 'w-6' : 'w-16'} h-28 overflow-hidden rounded-md flex items-center justify-center ${isComma ? 'bg-transparent' : 'bg-white shadow-md'}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${position}-${value}`}
          className={`absolute text-6xl font-bold ${isComma ? 'text-gray-500' : ''}`}
          variants={isComma ? {} : slideVariants}
          initial={isComma ? "center" : "enter"}
          animate="center"
          exit={isComma ? "center" : "exit"}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 25,
            mass: 0.6
          }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
      {isDecimal && (
        <div className="absolute bottom-1 right-1 text-2xl">.</div>
      )}
    </div>
  );
};

export default function FlipNumber({ value }) {
  const [currentValue, setCurrentValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  
  // Ensure we process the value to make it consistent
  const processedValue = typeof value === 'number' ? value.toString() : value;
  
  // Add a flag for each character to indicate if it's a comma
  const digitsWithInfo = processedValue.split('').map(char => ({
    char,
    isDecimal: char === '.',
    isComma: char === ','
  }));
  
  useEffect(() => {
    // Only update if value has actually changed from current value
    if (value !== currentValue) {
      setPrevValue(currentValue);
      setCurrentValue(value);
    }
  }, [value, currentValue]);

  // Automatic scaling for large numbers
  const containerClass = digitsWithInfo.length > 10 ? 'scale-90' : 
                         digitsWithInfo.length > 14 ? 'scale-80' : '';

  return (
    <motion.div 
      className={`flex flex-nowrap overflow-x-auto scrollbar-hide ${containerClass}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {digitsWithInfo.map((digitInfo, index) => (
        <motion.div
          key={`digit-container-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.03,
            duration: 0.3
          }}
        >
          <Digit 
            key={`digit-${index}-${digitInfo.char}`}
            position={index} 
            value={digitInfo.char} 
            prevValue={prevValue.toString().split('')[index] || '0'}
            isDecimal={digitInfo.isDecimal}
            isComma={digitInfo.isComma}
          />
        </motion.div>
      ))}
    </motion.div>
  );
} 