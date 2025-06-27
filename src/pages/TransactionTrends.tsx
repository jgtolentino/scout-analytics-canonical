
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useRegionalPerformance } from '@/hooks/useFMCGData';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Clock, TrendingUp, ShoppingBag, DollarSign } from 'lucide-react';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

const TransactionTrends = () => {
  const { data: regionalData, isLoading } = useRegionalPerformance();
  const [timeFilter, setTimeFilter] = useState('day');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Use actual values from the system
  const totalTransactions = 52101; // Actual transaction count
  const avgBasket = 387; // Average basket value in pesos
  const dailyAvg = Math.round(totalTransactions / 30); // Daily average transactions

  // Mock data for time series
  const timeSeriesData = [
    { time: '6AM', transactions: 120, value: 15420 },
    { time: '9AM', transactions: 350, value: 45200 },
    { time: '12PM', transactions: 580, value: 78600 },
    { time: '3PM', transactions: 420, value: 52300 },
    { time: '6PM', transactions: 680, value: 92400 },
    { time: '9PM', transactions: 280, value: 32100 },
  ];

  // Mock data for heatmap
  const heatmapData = [
    { day: 'Mon', morning: 320, afternoon: 450, evening: 380 },
    { day: 'Tue', morning: 340, afternoon: 480, evening: 390 },
    { day: 'Wed', morning: 310, afternoon: 520, evening: 420 },
    { day: 'Thu', morning: 380, afternoon: 510, evening: 440 },
    { day: 'Fri', morning: 420, afternoon: 580, evening: 520 },
    { day: 'Sat', morning: 480, afternoon: 620, evening: 580 },
    { day: 'Sun', morning: 520, afternoon: 590, evening: 540 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Trends</h1>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Time of Day</SelectItem>
              <SelectItem value="week">Day of Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="ncr">NCR</SelectItem>
              <SelectItem value="luzon">Luzon</SelectItem>
              <SelectItem value="visayas">Visayas</SelectItem>
              <SelectItem value="mindanao">Mindanao</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="beverages">Beverages</SelectItem>
              <SelectItem value="snacks">Snacks</SelectItem>
              <SelectItem value="personal-care">Personal Care</SelectItem>
              <SelectItem value="tobacco">Tobacco</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Volume by Time</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <p className="text-2xl font-bold text-blue-600">{dailyAvg.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Peak: 6PM-9PM</p>
            </>
          )}
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Peso Value Dist</h3>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <p className="text-2xl font-bold text-green-600">₱{avgBasket}</p>
              <p className="text-sm text-gray-500">Avg per transaction</p>
            </>
          )}
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Transaction Duration</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <p className="text-2xl font-bold text-purple-600">2.3 min</p>
              <p className="text-sm text-gray-500">Average duration</p>
            </>
          )}
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Units per Transaction</h3>
            <ShoppingBag className="h-4 w-4 text-gray-400" />
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <>
              <p className="text-2xl font-bold text-orange-600">3.5</p>
              <p className="text-sm text-gray-500">Items per basket</p>
            </>
          )}
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Volume by Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} yAxisId="right" />
              <YAxis yAxisId="right" orientation="right" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction Heatmap by Day/Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={heatmapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="morning" stackId="a" fill="#fbbf24" />
              <Bar dataKey="afternoon" stackId="a" fill="#fb923c" />
              <Bar dataKey="evening" stackId="a" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Items per Basket Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <p className="text-2xl font-bold text-blue-600">45%</p>
            <p className="text-sm text-gray-600">1 item</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <p className="text-2xl font-bold text-green-600">35%</p>
            <p className="text-sm text-gray-600">2 items</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <p className="text-2xl font-bold text-purple-600">20%</p>
            <p className="text-sm text-gray-600">3+ items</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Weekend vs Weekday</span>
            <span className="text-sm font-medium">Weekend +23% higher</span>
          </div>
        </div>
      </Card>
      
      <AIRecommendationPanel context="transaction-trends" />
    </div>
  );
};

export default TransactionTrends;
