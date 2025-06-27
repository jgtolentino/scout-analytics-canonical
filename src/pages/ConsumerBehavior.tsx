
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useStorePerformance, useCompetitiveAnalysis } from '@/hooks/useFMCGData';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';
import { MessageSquare, MousePointer, ThumbsUp, Users } from 'lucide-react';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

const ConsumerBehavior = () => {
  const { data: storeData, isLoading: storeLoading } = useStorePerformance();
  const { data: competitiveData, isLoading: competitiveLoading } = useCompetitiveAnalysis();
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');

  const avgVisitFreq = storeData?.reduce((sum, store) => sum + store.monthly_transactions, 0) / (storeData?.length || 1) / 30 || 0;
  const topTierStores = storeData?.filter(store => store.performance_tier === 'High') || [];
  const storesWithFridge = storeData?.filter(store => store.has_refrigerator) || [];

  // Mock data for preference signals
  const requestTypeData = [
    { name: 'Branded Request', value: 45, color: '#3b82f6' },
    { name: 'Unbranded Request', value: 30, color: '#10b981' },
    { name: 'Unsure/Asked Owner', value: 25, color: '#f59e0b' },
  ];

  const requestMethodData = [
    { name: 'Verbal', value: 60, color: '#8b5cf6' },
    { name: 'Pointing', value: 25, color: '#ec4899' },
    { name: 'Indirect', value: 15, color: '#06b6d4' },
  ];

  const acceptanceData = [
    { name: 'Accepted Suggestion', value: 68 },
    { name: 'Rejected Suggestion', value: 32 },
  ];

  const funnelData = [
    { name: 'Initial Interest', value: 1000, fill: '#3b82f6' },
    { name: 'Asked for Product', value: 850, fill: '#10b981' },
    { name: 'Considered Options', value: 600, fill: '#f59e0b' },
    { name: 'Made Purchase', value: 520, fill: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Consumer Behavior & Preference Signals</h1>
        <div className="flex gap-3">
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Brand/Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="beverages">Beverages</SelectItem>
              <SelectItem value="snacks">Snacks</SelectItem>
              <SelectItem value="personal-care">Personal Care</SelectItem>
              <SelectItem value="tobacco">Tobacco</SelectItem>
            </SelectContent>
          </Select>
          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Age Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="18-24">18-24</SelectItem>
              <SelectItem value="25-34">25-34</SelectItem>
              <SelectItem value="35-44">35-44</SelectItem>
              <SelectItem value="45+">45+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Request Type</h3>
            <MessageSquare className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600">45%</p>
          <p className="text-sm text-gray-500">Branded requests</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Request Method</h3>
            <MousePointer className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600">60%</p>
          <p className="text-sm text-gray-500">Verbal requests</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Acceptance Rate</h3>
            <ThumbsUp className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-green-600">68%</p>
          <p className="text-sm text-gray-500">Accept suggestions</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Purchase Decision</h3>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-orange-600">2.1 sec</p>
          <p className="text-sm text-gray-500">Avg decision time</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">How Products Are Requested</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Request Type</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={requestTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {requestTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Request Method</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={requestMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {requestMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Purchase Decision Funnel</h3>
          <ResponsiveContainer width="100%" height={250}>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="center" fill="#fff" stroke="none" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Store Owner Influence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <p className="text-3xl font-bold text-blue-600">{acceptanceData[0].value}%</p>
            <p className="text-sm text-gray-600">Accept store owner suggestions</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <p className="text-3xl font-bold text-green-600">3.2x</p>
            <p className="text-sm text-gray-600">More likely to buy promoted items</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <p className="text-3xl font-bold text-purple-600">₱45</p>
            <p className="text-sm text-gray-600">Higher basket when suggested</p>
          </div>
        </div>
      </Card>
      
      <AIRecommendationPanel context="consumer-behavior" />
    </div>
  );
};

export default ConsumerBehavior;
