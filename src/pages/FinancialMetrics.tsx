import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Percent, Package, ArrowUpRight, ArrowDownRight, AlertCircle } from 'lucide-react';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

// Revenue data
const revenueData = [
  { month: 'Jan', revenue: 2850000, growth: 12, profit: 427500 },
  { month: 'Feb', revenue: 3120000, growth: 9.5, profit: 468000 },
  { month: 'Mar', revenue: 3450000, growth: 10.6, profit: 517500 },
  { month: 'Apr', revenue: 3280000, growth: -4.9, profit: 492000 },
  { month: 'May', revenue: 3690000, growth: 12.5, profit: 553500 },
  { month: 'Jun', revenue: 3950000, growth: 7.0, profit: 592500 },
];

// Category profitability
const categoryProfitability = [
  { category: 'Personal Care', revenue: 4200000, cost: 3150000, margin: 25 },
  { category: 'Beverages', revenue: 3800000, cost: 3040000, margin: 20 },
  { category: 'Snacks', revenue: 3500000, cost: 2975000, margin: 15 },
  { category: 'Household', revenue: 2900000, cost: 2320000, margin: 20 },
  { category: 'Dairy', revenue: 2600000, cost: 2210000, margin: 15 },
  { category: 'Condiments', revenue: 1800000, cost: 1440000, margin: 20 },
  { category: 'Canned Goods', revenue: 1400000, cost: 1190000, margin: 15 },
];

// Basket analysis data
const basketData = [
  { size: '1-2 items', count: 12500, avgValue: 95, percentage: 24 },
  { size: '3-5 items', count: 18900, avgValue: 285, percentage: 36 },
  { size: '6-10 items', count: 14200, avgValue: 540, percentage: 27 },
  { size: '11-15 items', count: 5100, avgValue: 890, percentage: 10 },
  { size: '16+ items', count: 1401, avgValue: 1450, percentage: 3 },
];

// Price point distribution
const priceDistribution = [
  { range: '₱0-50', count: 15600, revenue: 468000 },
  { range: '₱51-100', count: 12400, revenue: 930000 },
  { range: '₱101-200', count: 9800, revenue: 1470000 },
  { range: '₱201-500', count: 8900, revenue: 3115000 },
  { range: '₱501-1000', count: 4200, revenue: 2940000 },
  { range: '₱1000+', count: 1201, revenue: 1681400 },
];

// Margin trend data
const marginTrend = [
  { week: 'W1', margin: 18.2, target: 20 },
  { week: 'W2', margin: 19.1, target: 20 },
  { week: 'W3', margin: 17.8, target: 20 },
  { week: 'W4', margin: 19.5, target: 20 },
  { week: 'W5', margin: 20.2, target: 20 },
  { week: 'W6', margin: 19.8, target: 20 },
  { week: 'W7', margin: 21.3, target: 20 },
  { week: 'W8', margin: 20.5, target: 20 },
];

// Store performance by revenue
const storeRevenue = [
  { store: 'Store #45', revenue: 892000, growth: 15.2, margin: 22.5 },
  { store: 'Store #12', revenue: 785000, growth: 12.8, margin: 21.2 },
  { store: 'Store #78', revenue: 698000, growth: -5.3, margin: 18.9 },
  { store: 'Store #23', revenue: 675000, growth: 8.7, margin: 20.1 },
  { store: 'Store #91', revenue: 642000, growth: 22.4, margin: 23.8 },
];

// Daily sales patterns
const dailySalesPattern = [
  { hour: '6AM', sales: 120000, transactions: 156 },
  { hour: '7AM', sales: 185000, transactions: 241 },
  { hour: '8AM', sales: 290000, transactions: 378 },
  { hour: '9AM', sales: 425000, transactions: 554 },
  { hour: '10AM', sales: 560000, transactions: 730 },
  { hour: '11AM', sales: 680000, transactions: 887 },
  { hour: '12PM', sales: 890000, transactions: 1161 },
  { hour: '1PM', sales: 820000, transactions: 1070 },
  { hour: '2PM', sales: 750000, transactions: 978 },
  { hour: '3PM', sales: 690000, transactions: 900 },
  { hour: '4PM', sales: 780000, transactions: 1017 },
  { hour: '5PM', sales: 920000, transactions: 1200 },
  { hour: '6PM', sales: 1050000, transactions: 1370 },
  { hour: '7PM', sales: 890000, transactions: 1161 },
  { hour: '8PM', sales: 620000, transactions: 809 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const FinancialMetrics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const recommendations = [
    {
      id: 1,
      title: 'Margin Optimization Alert',
      description: 'Snacks category margin at 15% is below target. Consider price adjustments or supplier negotiations.',
      priority: 'high' as const,
      metric: '-5% below target',
    },
    {
      id: 2,
      title: 'Revenue Growth Opportunity',
      description: 'Store #91 showing 22.4% growth. Replicate successful strategies to other locations.',
      priority: 'medium' as const,
      metric: '+22.4% YoY',
    },
    {
      id: 3,
      title: 'Peak Hour Optimization',
      description: 'Maximize 6PM peak hour with targeted promotions. Currently generating ₱1.05M/hour.',
      priority: 'medium' as const,
      metric: '₱1.05M peak revenue',
    },
    {
      id: 4,
      title: 'Basket Size Opportunity',
      description: '60% of transactions are under 5 items. Implement bundle offers to increase average basket size.',
      priority: 'low' as const,
      metric: 'Avg 4.2 items/basket',
    },
  ];

  // Calculate KPIs
  const totalRevenue = 20200000;
  const totalProfit = 3838000;
  const avgMargin = 19.0;
  const avgBasketValue = 387;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Metrics</h1>
          <p className="text-gray-600 mt-1">Revenue, profitability, and basket analytics</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5% vs last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalProfit / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15.2% growth
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Margin</p>
              <p className="text-2xl font-bold text-gray-900">{avgMargin}%</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingDown className="h-4 w-4 mr-1" />
                -1% vs target
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Percent className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Basket Value</p>
              <p className="text-2xl font-bold text-gray-900">₱{avgBasketValue}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8.2% increase
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <ShoppingCart className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue & Profit Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₱${(value as number).toLocaleString()}`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Profitability</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryProfitability} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip formatter={(value) => `₱${(value as number).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="cost" fill="#ef4444" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Basket Analysis & Price Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Basket Size Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={basketData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percentage }) => `${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="percentage"
              >
                {basketData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {basketData.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  {item.size}
                </span>
                <span className="text-gray-600">
                  {item.count.toLocaleString()} baskets (₱{item.avgValue} avg)
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Price Point Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Transaction Count" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (₱)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Margin Trend & Store Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Margin Trend vs Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marginTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis domain={[15, 25]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="margin" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Actual Margin"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#ef4444" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Stores by Revenue</h3>
          <div className="space-y-4">
            {storeRevenue.map((store, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{store.store}</p>
                    <p className="text-sm text-gray-600">Margin: {store.margin}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₱{store.revenue.toLocaleString()}</p>
                  <p className={`text-sm flex items-center justify-end ${store.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {store.growth > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                    {Math.abs(store.growth)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Daily Sales Pattern */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Sales Pattern</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailySalesPattern}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            <Tooltip />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="sales" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Sales (₱)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="transactions" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Transactions"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* AI Recommendations */}
      <AIRecommendationPanel recommendations={recommendations} />
    </div>
  );
};

export default FinancialMetrics;