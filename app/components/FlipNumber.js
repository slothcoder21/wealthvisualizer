'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Digit = ({ position, value, prevValue, isDecimal }) => {
  const slideVariants = {
    enter: { y: -80, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: 80, opacity: 0 },
  };

  return (
    <div className="relative w-12 h-20 overflow-hidden rounded-md flex items-center justify-center bg-white shadow-sm">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${position}-${value}`}
          className="absolute text-4xl font-bold"
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30
          }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
      {isDecimal && (
        <div className="absolute bottom-0 right-0 text-xl">.</div>
      )}
    </div>
  );
};

export default function FlipNumber({ value }) {
  const [currentValue, setCurrentValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  
  // Ensure we process the value to make it consistent
  const processedValue = typeof value === 'number' ? value.toString() : value;
  const digits = processedValue.split('');
  
  useEffect(() => {
    // Always update on value changes to ensure we show the latest
    setPrevValue(currentValue);
    setCurrentValue(value);
  }, [value]);

  return (
    <div className="flex">
      {digits.map((digit, index) => (
        <Digit 
          key={`digit-${index}-${digit}`}
          position={index} 
          value={digit} 
          prevValue={prevValue.toString().split('')[index] || '0'}
          isDecimal={digit === '.'}
        />
      ))}
    </div>
  );
} 