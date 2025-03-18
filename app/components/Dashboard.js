'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FlipNumber from './FlipNumber';
import SalaryChart from './SalaryChart';
import ComparisonChart from './ComparisonChart';

// Conversion factors for different salary types - ADJUSTED TO SHOW FASTER ACCUMULATION
const CONVERSION_FACTORS = {
  hourly: 1 / 60, // per second (60x faster)
  daily: 1 / (24 * 60), // per second (60x faster)
  weekly: 1 / (7 * 24 * 60), // per second (60x faster)
  monthly: 1 / (30 * 24 * 60), // per second (60x faster)
  yearly: 1 / (365 * 24 * 60), // per second (60x faster)
};

const calculateSalaryAccumulation = (salary, timePassed, salaryType) => {
  // Convert salary to per second rate based on salary type
  const perSecond = salary * CONVERSION_FACTORS[salaryType];
  
  // Calculate total salary earned in the elapsed time
  return perSecond * timePassed;
};

export default function Dashboard() {
  const [salary, setSalary] = useState(1000);
  const [inputValue, setInputValue] = useState('1000');
  const [totalEarned, setTotalEarned] = useState(0);
  const [isRunning, setIsRunning] = useState(true); // Start running by default
  const [salaryType, setSalaryType] = useState('hourly');
  const startTimeRef = useRef(Date.now());
  const animationRef = useRef(null);
  
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
        const earned = calculateSalaryAccumulation(salary, timeElapsed, salaryType);
        setTotalEarned(earned);
      }, 30); // Update faster for smoother animation
      
      // Save interval ID for cleanup
      animationRef.current = interval;
      
      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    }
  }, [isRunning, salary, salaryType]);
  
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
      // Restart the counter if already running
      if (isRunning) {
        setIsRunning(false);
        setTimeout(() => setIsRunning(true), 10);
      }
    }
  };
  
  const toggleAnimation = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      startTimeRef.current = Date.now();
      setTotalEarned(0);
    }
  };

  const formatCurrency = (value) => {
    return value.toFixed(2);
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
    <div className="flex flex-col w-full max-w-6xl mx-auto p-6 gap-6">
      <motion.div 
        className="bg-white shadow-lg rounded-xl p-6 w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Salary Visualizer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="salaryType" className="block text-sm font-medium text-gray-700">
                  Salary Type
                </label>
                <select
                  id="salaryType"
                  value={salaryType}
                  onChange={handleSalaryTypeChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                >
                  Update
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={toggleAnimation}
                  className={`flex-1 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isRunning 
                      ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500' 
                      : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRunning ? 'Stop' : 'Start'}
                </motion.button>
              </div>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              {isRunning ? 'Money Accumulating:' : 'Ready to Visualize'}
            </h2>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-2">$</span>
              <FlipNumber value={formatCurrency(totalEarned)} />
            </div>
            <p className="text-sm text-gray-500">
              Based on ${salary}/{formatSalaryLabel().toLowerCase()}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalaryChart />
          <ComparisonChart />
        </div>
      </motion.div>
    </div>
  );
} 