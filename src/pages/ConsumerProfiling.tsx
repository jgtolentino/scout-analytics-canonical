import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';
import { Users, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

const ConsumerProfiling = () => {
  const [barangayFilter, setBarangayFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  // Mock data for demographics
  const genderData = [
    { name: 'Male', value: 58, color: '#3b82f6' },
    { name: 'Female', value: 42, color: '#ec4899' },
  ];

  const ageData = [
    { age: '18-24', male: 15, female: 12 },
    { age: '25-34', male: 25, female: 20 },
    { age: '35-44', male: 20, female: 18 },
    { age: '45-54', male: 15, female: 16 },
    { age: '55+', male: 10, female: 12 },
  ];

  const locationData = [
    { region: 'NCR', stores: 45, transactions: 15000, avgBasket: 285 },
    { region: 'Central Luzon', stores: 32, transactions: 12000, avgBasket: 245 },
    { region: 'Calabarzon', stores: 28, transactions: 10500, avgBasket: 260 },
    { region: 'Western Visayas', stores: 22, transactions: 8200, avgBasket: 230 },
    { region: 'Central Visayas', stores: 18, transactions: 7800, avgBasket: 225 },
    { region: 'Davao Region', stores: 15, transactions: 6500, avgBasket: 215 },
  ];

  const demographicTreeData = [
    {
      category: 'Young Adults (18-34)',
      percentage: 45,
      subgroups: [
        { name: 'Students', value: 15 },
        { name: 'Young Professionals', value: 20 },
        { name: 'Blue Collar', value: 10 },
      ],
    },
    {
      category: 'Middle Age (35-54)',
      percentage: 35,
      subgroups: [
        { name: 'Parents', value: 20 },
        { name: 'Business Owners', value: 10 },
        { name: 'Employees', value: 5 },
      ],
    },
    {
      category: 'Seniors (55+)',
      percentage: 20,
      subgroups: [
        { name: 'Retirees', value: 12 },
        { name: 'Working Seniors', value: 8 },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Consumer Profiling</h1>
        <div className="flex gap-3">
          <Select value={barangayFilter} onValueChange={setBarangayFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Barangay" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Barangays</SelectItem>
              <SelectItem value="poblacion">Poblacion</SelectItem>
              <SelectItem value="san-jose">San Jose</SelectItem>
              <SelectItem value="santo-nino">Santo Niño</SelectItem>
              <SelectItem value="bagong-silang">Bagong Silang</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Product Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="beverages">Beverages</SelectItem>
              <SelectItem value="snacks">Snacks</SelectItem>
              <SelectItem value="personal-care">Personal Care</SelectItem>
              <SelectItem value="tobacco">Tobacco</SelectItem>
            </SelectContent>
          </Select>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="coke">Coca-Cola</SelectItem>
              <SelectItem value="unilever">Unilever</SelectItem>
              <SelectItem value="pg">P&G</SelectItem>
              <SelectItem value="nestle">Nestle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Consumers</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600">52,101</p>
          <p className="text-sm text-gray-500">Unique shoppers</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Age</h3>
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-green-600">32 years</p>
          <p className="text-sm text-gray-500">Median: 28</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Coverage</h3>
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600">17 regions</p>
          <p className="text-sm text-gray-500">138 stores</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Growth</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-orange-600">+12%</p>
          <p className="text-sm text-gray-500">New customers</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {genderData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Age Bracket Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" stackId="a" fill="#3b82f6" />
              <Bar dataKey="female" stackId="a" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="stores" fill="#3b82f6" />
            <Bar yAxisId="left" dataKey="transactions" fill="#10b981" />
            <Area yAxisId="right" type="monotone" dataKey="avgBasket" stroke="#f59e0b" fill="#fbbf24" fillOpacity={0.3} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Consumer Segments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demographicTreeData.map((segment, index) => (
            <div key={index} className="border rounded p-4">
              <h4 className="font-medium text-lg mb-2">{segment.category}</h4>
              <p className="text-2xl font-bold text-blue-600 mb-3">{segment.percentage}%</p>
              <div className="space-y-2">
                {segment.subgroups.map((sub, subIndex) => (
                  <div key={subIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{sub.name}</span>
                    <span className="text-sm font-medium">{sub.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <AIRecommendationPanel context="consumer-profiling" />
    </div>
  );
};

export default ConsumerProfiling;