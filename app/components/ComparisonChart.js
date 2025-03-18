'use client';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

// Salary comparison data
const comparisonData = [
  { job: 'Retail', salary: 35000 },
  { job: 'Teacher', salary: 55000 },
  { job: 'Nurse', salary: 75000 },
  { job: 'Engineer', salary: 95000 },
  { job: 'Doctor', salary: 180000 },
  { job: 'CEO', salary: 260000 },
];

// Format large numbers with commas
const formatCurrency = (value) => {
  if (!value) return '$0';
  return '$' + value.toLocaleString();
};

export default function ComparisonChart() {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={comparisonData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="job" />
          <YAxis 
            tickFormatter={formatCurrency}
            width={80}
          />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Bar 
            dataKey="salary" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 