'use client';

import { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// US Historical salary data (approximated median values)
const historicalData = [
  { year: 1960, salary: 4000 },
  { year: 1970, salary: 6500 },
  { year: 1980, salary: 12500 },
  { year: 1990, salary: 21000 },
  { year: 2000, salary: 33000 },
  { year: 2010, salary: 46000 },
  { year: 2020, salary: 56000 },
  { year: 2023, salary: 65000 },
  { year: 2024, salary: 62000 },
];

// Format large numbers with commas
const formatCurrency = (value) => {
  if (!value) return '$0';
  return '$' + value.toLocaleString();
};

export default function SalaryChart() {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={historicalData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="year" />
          <YAxis 
            tickFormatter={formatCurrency}
            width={80}
          />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Area 
            type="monotone" 
            dataKey="salary" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorSalary)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 