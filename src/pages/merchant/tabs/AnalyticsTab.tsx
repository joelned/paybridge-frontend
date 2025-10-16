import React from 'react';
import { Card } from '../../../components/common/Card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AnalyticsTab: React.FC = () => {
  const chartData = [
    { name: 'Jan', revenue: 4000, transactions: 240, successRate: 98.5 },
    { name: 'Feb', revenue: 3000, transactions: 198, successRate: 97.8 },
    { name: 'Mar', revenue: 5000, transactions: 320, successRate: 98.2 },
    { name: 'Apr', revenue: 4500, transactions: 278, successRate: 99.1 },
    { name: 'May', revenue: 6000, transactions: 389, successRate: 98.8 },
    { name: 'Jun', revenue: 5500, transactions: 349, successRate: 98.4 }
  ];

  const providerData = [
    { name: 'Stripe', value: 45, color: '#6366f1' },
    { name: 'PayPal', value: 35, color: '#10b981' },
    { name: 'Flutterwave', value: 20, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Analytics & Insights</h2>
        <p className="text-sm text-gray-600 mt-1">Unified analytics across all payment providers</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={providerData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {providerData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="transactions" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" domain={[95, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="successRate" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};