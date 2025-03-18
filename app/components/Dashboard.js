'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlipNumber from './FlipNumber';
import SalaryChart from './SalaryChart';
import ComparisonChart from './ComparisonChart';

// Base conversion factors for different salary types
const BASE_CONVERSION_FACTORS = {
  hourly: 1 / 3600, // per second (1 hour = 3600 seconds)
  daily: 1 / (24 * 3600), // per second (1 day = 24 hours = 86400 seconds)
  weekly: 1 / (7 * 24 * 3600), // per second (1 week = 7 days = 168 hours = 604800 seconds)
  monthly: 1 / (30 * 24 * 3600), // per second (1 month ≈ 30 days = 720 hours = 2592000 seconds)
  yearly: 1 / (365 * 24 * 3600), // per second (1 year = 365 days = 8760 hours = 31536000 seconds)
};

// Set all multipliers to 1 for real-time visualization
// Note: Most salaries will appear to grow very slowly in real-time
const VISUALIZATION_MULTIPLIERS = {
  hourly: 1,   // Real-time hourly wage accumulation
  daily: 1,    // Real-time daily salary accumulation
  weekly: 1,   // Real-time weekly salary accumulation
  monthly: 1,  // Real-time monthly salary accumulation
  yearly: 1    // Real-time yearly salary accumulation
};

// Dashboard card component
const DashboardCard = ({ title, children, className = "" }) => (
  <motion.div 
    className={`bg-white rounded-xl shadow-md p-5 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <h2 className="text-lg font-medium mb-4 text-gray-700 border-b pb-2">{title}</h2>
    {children}
  </motion.div>
);

export default function Dashboard() {
  const [salary, setSalary] = useState(1000);
  const [inputValue, setInputValue] = useState('1000');
  const [totalEarned, setTotalEarned] = useState(0);
  const [isRunning, setIsRunning] = useState(true); // Start running by default
  const [salaryType, setSalaryType] = useState('hourly');
  const startTimeRef = useRef(Date.now());
  const animationRef = useRef(null);
  
  // Use a ref to track the current values without causing re-renders
  const salaryRef = useRef(salary);
  const salaryTypeRef = useRef(salaryType);
  const isRunningRef = useRef(isRunning);
  const inputValueRef = useRef(inputValue);
  
  // Move calculateSalaryAccumulation inside the component and use useCallback
  const calculateSalaryAccumulation = useCallback((salary, timePassed, salaryType) => {
    // Convert salary to per second rate based on salary type
    const perSecond = salary * BASE_CONVERSION_FACTORS[salaryType];
    
    // Apply visualization multiplier for visual effect
    // This makes the numbers increase at a rate that is visually meaningful
    return perSecond * timePassed * VISUALIZATION_MULTIPLIERS[salaryType];
  }, [/* No dependencies here */]);
  
  // Define toggleAnimation with useCallback before it's used in any effects
  const toggleAnimation = useCallback(() => {
    const wasRunning = isRunningRef.current;
    setIsRunning(!wasRunning);
    isRunningRef.current = !wasRunning;
    
    if (!wasRunning) {
      // Starting the animation - update salary from input if needed
      const newSalary = parseFloat(inputValueRef.current);
      if (!isNaN(newSalary) && newSalary > 0) {
        setSalary(newSalary);
        salaryRef.current = newSalary;
      } else {
        // If input is invalid, update input to match current salary
        setInputValue(salaryRef.current.toString());
        inputValueRef.current = salaryRef.current.toString();
      }
      
      startTimeRef.current = Date.now();
      setTotalEarned(0);
    }
  }, []);
  
  // Add keyboard listener for space bar to toggle animation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle animation when space bar is pressed, but not when typing in input fields
      if (e.key === ' ' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        toggleAnimation();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleAnimation]);
  
  // Update refs when values change
  useEffect(() => {
    salaryRef.current = salary;
    salaryTypeRef.current = salaryType;
    isRunningRef.current = isRunning;
    inputValueRef.current = inputValue;
  }, [salary, salaryType, isRunning, inputValue]);
  
  // Initialize the animation on component mount
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);
  
  // Run the animation when isRunning changes
  useEffect(() => {
    if (isRunning) {
      // Clear any existing intervals first
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
      
      // Reset the timer when visualization starts
      startTimeRef.current = Date.now();
      setTotalEarned(0);
      
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000; // in seconds
        // Use ref values to prevent the effect from re-running
        const earned = calculateSalaryAccumulation(
          salaryRef.current, 
          timeElapsed, 
          salaryTypeRef.current
        );
        setTotalEarned(earned); // Set directly to the calculated value
      }, 50); // Slightly slower updates to reduce CPU load
      
      // Save interval ID for cleanup
      animationRef.current = interval;
      
      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    }
  }, [isRunning, calculateSalaryAccumulation]); // Only depend on isRunning and the stable function
  
  const handleAmountChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSalaryTypeChange = (e) => {
    setSalaryType(e.target.value);
    // Reset timer when salary type changes
    if (isRunning) {
      setIsRunning(false);
      setTimeout(() => setIsRunning(true), 10);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSalary = parseFloat(inputValue);
    if (!isNaN(newSalary) && newSalary > 0) {
      setSalary(newSalary); 
      // Restart the visualization with the new salary
      if (isRunning) {
        setIsRunning(false);
        setTimeout(() => setIsRunning(true), 10);
      }
    }
  };
  
  const formatCurrency = (value) => {
    // Prevent errors with extremely large numbers
    if (!isFinite(value) || isNaN(value)) {
      return "0.00";
    }
    
    // Cap the displayed value to prevent breaking the UI
    const cappedValue = Math.min(value, 999999999999999); // 999 trillion max
    
    // For very large numbers, show with commas
    if (cappedValue >= 1000) {
      return cappedValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    // For smaller numbers, show two decimal places
    return cappedValue.toFixed(2);
  };
  
  const formatSalaryLabel = () => {
    switch(salaryType) {
      case 'hourly': return 'Hour';
      case 'daily': return 'Day';
      case 'weekly': return 'Week';
      case 'monthly': return 'Month';
      case 'yearly': return 'Year';
      default: return 'Hour';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Large Real-time Earnings Display (Full Width) */}
      <motion.div 
        className="bg-white rounded-xl shadow-lg p-8 w-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div 
            className="text-xl text-gray-500 mb-3"
            animate={{ opacity: isRunning ? 1 : 0.7 }}
            transition={{ duration: 0.5 }}
          >
            {isRunning ? 'Money Accumulating At Actual Real-time Rate' : 'Visualization Paused'}
          </motion.div>
          
          <div className="w-full overflow-x-auto scrollbar-hide py-6 flex justify-center">
            <motion.div 
              className="flex items-center min-w-fit"
              animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <motion.span 
                className="text-6xl mr-3 font-bold text-primary"
                animate={{ opacity: [0.8, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              >
                $
              </motion.span>
              <FlipNumber value={formatCurrency(totalEarned)} />
            </motion.div>
          </div>
          
          {/* Force re-render with unique key when salary or type changes */}
          <motion.div 
            key={`${salary}-${salaryType}`}
            className="mt-3"
          >
            <motion.p 
              className="text-sm text-gray-500"
              animate={{ opacity: [0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              Based on ${Number(salary).toLocaleString()}/{formatSalaryLabel().toLowerCase()} (Real-time)
            </motion.p>
          </motion.div>
          
          <motion.button
            type="button"
            onClick={toggleAnimation}
            className={`mt-6 px-8 py-3 rounded-full font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRunning 
                ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500' 
                : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {isRunning ? 'Pause Visualization' : 'Start Visualization'}
          </motion.button>
        </div>
      </motion.div>
      
      {/* Grid Layout for Controls and Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Card */}
        <DashboardCard title="Salary Input">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="salaryType" className="block text-sm font-medium text-gray-700">
                Salary Type
              </label>
              <select
                id="salaryType"
                value={salaryType}
                onChange={handleSalaryTypeChange}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                <option value="hourly">Hourly Wage</option>
                <option value="daily">Daily Salary</option>
                <option value="weekly">Weekly Salary</option>
                <option value="monthly">Monthly Salary</option>
                <option value="yearly">Yearly Salary</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount (${formatSalaryLabel()})
              </label>
              <input
                type="number"
                id="amount"
                value={inputValue}
                onChange={handleAmountChange}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                placeholder={`Enter ${salaryType} salary`}
                min="1"
                step="any"
              />
            </div>
            
            <div className="flex gap-2">
              <motion.button
                type="submit"
                className="flex-1 bg-primary text-white font-medium py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Update
              </motion.button>
            </div>
          </form>
        </DashboardCard>
        
        {/* Summary Stats Card */}
        <DashboardCard title="Earnings Summary">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Per Hour</span>
              <span className="font-medium">${
                salaryType === 'hourly' ? salary.toFixed(2) :
                salaryType === 'daily' ? (salary / 24).toFixed(2) :
                salaryType === 'weekly' ? (salary / (24 * 7)).toFixed(2) :
                salaryType === 'monthly' ? (salary / (24 * 30)).toFixed(2) :
                (salary / (24 * 365)).toFixed(2)
              }</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Per Day</span>
              <span className="font-medium">${
                salaryType === 'hourly' ? (salary * 24).toFixed(2) :
                salaryType === 'daily' ? salary.toFixed(2) :
                salaryType === 'weekly' ? (salary / 7).toFixed(2) :
                salaryType === 'monthly' ? (salary / 30).toFixed(2) :
                (salary / 365).toFixed(2)
              }</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Per Week</span>
              <span className="font-medium">${
                salaryType === 'hourly' ? (salary * 24 * 7).toFixed(2) :
                salaryType === 'daily' ? (salary * 7).toFixed(2) :
                salaryType === 'weekly' ? salary.toFixed(2) :
                salaryType === 'monthly' ? (salary / 4.33).toFixed(2) :
                (salary / 52).toFixed(2)
              }</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Per Month</span>
              <span className="font-medium">${
                salaryType === 'hourly' ? (salary * 24 * 30).toFixed(2) :
                salaryType === 'daily' ? (salary * 30).toFixed(2) :
                salaryType === 'weekly' ? (salary * 4.33).toFixed(2) :
                salaryType === 'monthly' ? salary.toFixed(2) :
                (salary / 12).toFixed(2)
              }</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Per Year</span>
              <span className="font-medium">${
                salaryType === 'hourly' ? (salary * 24 * 365).toFixed(2) :
                salaryType === 'daily' ? (salary * 365).toFixed(2) :
                salaryType === 'weekly' ? (salary * 52).toFixed(2) :
                salaryType === 'monthly' ? (salary * 12).toFixed(2) :
                salary.toFixed(2)
              }</span>
            </div>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Average US Salaries by Profession">
          <div className="h-64">
            <ComparisonChart />
          </div>
        </DashboardCard>
        
        {/* Charts */}
        <DashboardCard title="Historical US Median Annual Salary" className="md:col-span-3">
          <div className="h-72">
            <SalaryChart />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}