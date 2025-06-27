import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, PieChart, Pie } from 'recharts';
import { Users, TrendingUp, DollarSign, Calendar, Star, Target, AlertTriangle, Crown, Heart, Zap } from 'lucide-react';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

// RFM Segmentation Data
const rfmSegmentData = [
  // Champions (High R, F, M)
  { customerId: 'C001', recency: 5, frequency: 15, monetary: 850000, segment: 'Champions', clv: 2500000, loyaltyScore: 95 },
  { customerId: 'C045', recency: 4, frequency: 12, monetary: 720000, segment: 'Champions', clv: 2100000, loyaltyScore: 92 },
  { customerId: 'C123', recency: 5, frequency: 14, monetary: 680000, segment: 'Champions', clv: 1950000, loyaltyScore: 90 },
  
  // Loyal Customers (High F, M, Medium R)
  { customerId: 'C234', recency: 3, frequency: 10, monetary: 520000, segment: 'Loyal', clv: 1500000, loyaltyScore: 82 },
  { customerId: 'C345', recency: 3, frequency: 9, monetary: 480000, segment: 'Loyal', clv: 1350000, loyaltyScore: 78 },
  { customerId: 'C456', recency: 2, frequency: 11, monetary: 560000, segment: 'Loyal', clv: 1600000, loyaltyScore: 85 },
  
  // Potential Loyalists (High R, Medium F, M)
  { customerId: 'C567', recency: 5, frequency: 6, monetary: 320000, segment: 'Potential Loyalists', clv: 950000, loyaltyScore: 68 },
  { customerId: 'C678', recency: 4, frequency: 7, monetary: 380000, segment: 'Potential Loyalists', clv: 1100000, loyaltyScore: 72 },
  { customerId: 'C789', recency: 5, frequency: 5, monetary: 290000, segment: 'Potential Loyalists', clv: 850000, loyaltyScore: 65 },
  
  // New Customers (High R, Low F, M)
  { customerId: 'C890', recency: 5, frequency: 2, monetary: 150000, segment: 'New Customers', clv: 450000, loyaltyScore: 45 },
  { customerId: 'C901', recency: 4, frequency: 3, monetary: 180000, segment: 'New Customers', clv: 520000, loyaltyScore: 48 },
  
  // At Risk (Low R, High F, M)
  { customerId: 'C012', recency: 1, frequency: 8, monetary: 420000, segment: 'At Risk', clv: 980000, loyaltyScore: 35 },
  { customerId: 'C135', recency: 2, frequency: 9, monetary: 380000, segment: 'At Risk', clv: 850000, loyaltyScore: 38 },
  
  // Cannot Lose Them (Low R, High F, M)
  { customerId: 'C246', recency: 1, frequency: 12, monetary: 650000, segment: 'Cannot Lose Them', clv: 1800000, loyaltyScore: 25 },
  
  // Hibernating (Low R, F, M)
  { customerId: 'C357', recency: 1, frequency: 3, monetary: 180000, segment: 'Hibernating', clv: 320000, loyaltyScore: 15 },
  { customerId: 'C468', recency: 2, frequency: 2, monetary: 120000, segment: 'Hibernating', clv: 250000, loyaltyScore: 12 },
];

// Customer Lifetime Value trends
const clvTrendData = [
  { month: 'Jan', champions: 2400000, loyal: 1450000, potential: 980000, newCustomers: 480000, atRisk: 890000 },
  { month: 'Feb', champions: 2450000, loyal: 1480000, potential: 1020000, newCustomers: 520000, atRisk: 840000 },
  { month: 'Mar', champions: 2520000, loyal: 1520000, potential: 1080000, newCustomers: 580000, atRisk: 780000 },
  { month: 'Apr', champions: 2580000, loyal: 1560000, potential: 1120000, newCustomers: 620000, atRisk: 720000 },
  { month: 'May', champions: 2640000, loyal: 1600000, potential: 1150000, newCustomers: 650000, atRisk: 680000 },
  { month: 'Jun', champions: 2700000, loyal: 1640000, potential: 1180000, newCustomers: 680000, atRisk: 640000 },
];

// Segment distribution
const segmentDistribution = [
  { segment: 'Champions', count: 38, percentage: 12.5, color: '#10b981' },
  { segment: 'Loyal', count: 72, percentage: 23.7, color: '#3b82f6' },
  { segment: 'Potential Loyalists', count: 85, percentage: 28.0, color: '#8b5cf6' },
  { segment: 'New Customers', count: 56, percentage: 18.4, color: '#f59e0b' },
  { segment: 'At Risk', count: 32, percentage: 10.5, color: '#ef4444' },
  { segment: 'Cannot Lose Them', count: 12, percentage: 3.9, color: '#dc2626' },
  { segment: 'Hibernating', count: 9, percentage: 3.0, color: '#6b7280' },
];

// Cohort analysis data
const cohortData = [
  { cohort: '2024-01', month1: 100, month2: 85, month3: 72, month4: 68, month5: 65, month6: 62 },
  { cohort: '2024-02', month1: 100, month2: 88, month3: 75, month4: 70, month5: 67, month6: 64 },
  { cohort: '2024-03', month1: 100, month2: 90, month3: 78, month4: 73, month5: 69, month6: 66 },
  { cohort: '2024-04', month1: 100, month2: 87, month3: 74, month4: 69, month5: 65, month6: 62 },
  { cohort: '2024-05', month1: 100, month2: 92, month3: 80, month4: 75, month5: 71, month6: 68 },
  { cohort: '2024-06', month1: 100, month2: 89, month3: 77, month4: 72, month5: 68, month6: 65 },
];

const CustomerIntelligence = () => {
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('clv');
  const [activeTab, setActiveTab] = useState('rfm');

  // Filter data based on selection
  const filteredData = rfmSegmentData.filter(customer => 
    selectedSegment === 'all' || customer.segment === selectedSegment
  );

  // Calculate metrics
  const totalCustomers = rfmSegmentData.length;
  const avgClv = rfmSegmentData.reduce((sum, c) => sum + c.clv, 0) / totalCustomers;
  const avgLoyalty = rfmSegmentData.reduce((sum, c) => sum + c.loyaltyScore, 0) / totalCustomers;
  const championsCount = rfmSegmentData.filter(c => c.segment === 'Champions').length;

  // Custom tooltip for RFM scatter
  const RFMTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded shadow-lg border">
          <p className="font-semibold">{data.customerId}</p>
          <p className="text-sm text-gray-600">{data.segment}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p>Recency: {data.recency}/5</p>
            <p>Frequency: {data.frequency} visits</p>
            <p>Monetary: ₱{(data.monetary / 1000).toFixed(0)}K</p>
            <p>CLV: ₱{(data.clv / 1000000).toFixed(1)}M</p>
            <p>Loyalty: {data.loyaltyScore}%</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Get segment color
  const getSegmentColor = (segment: string) => {
    const segmentColors: Record<string, string> = {
      'Champions': '#10b981',
      'Loyal': '#3b82f6',
      'Potential Loyalists': '#8b5cf6',
      'New Customers': '#f59e0b',
      'At Risk': '#ef4444',
      'Cannot Lose Them': '#dc2626',
      'Hibernating': '#6b7280',
    };
    return segmentColors[segment] || '#6b7280';
  };

  const recommendations = [
    {
      id: 1,
      title: 'Reward Champions',
      description: '38 champion customers generate 35% of CLV. Implement VIP program with exclusive benefits.',
      priority: 'high' as const,
      metric: '₱2.7M avg CLV',
    },
    {
      id: 2,
      title: 'Nurture Potential Loyalists',
      description: '85 customers showing potential. Target with personalized offers to increase frequency.',
      priority: 'high' as const,
      metric: '28% of customer base',
    },
    {
      id: 3,
      title: 'Win Back At Risk',
      description: '32 valuable customers showing decline. Launch immediate retention campaign.',
      priority: 'high' as const,
      metric: '₱980K avg CLV',
    },
    {
      id: 4,
      title: 'Activate New Customers',
      description: '56 new customers need onboarding. Implement welcome series and early engagement.',
      priority: 'medium' as const,
      metric: '18.4% new customers',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Intelligence</h1>
          <p className="text-gray-600 mt-1">RFM segmentation, CLV analysis, and retention insights</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedSegment} onValueChange={setSelectedSegment}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Segments</SelectItem>
              <SelectItem value="Champions">Champions</SelectItem>
              <SelectItem value="Loyal">Loyal Customers</SelectItem>
              <SelectItem value="Potential Loyalists">Potential Loyalists</SelectItem>
              <SelectItem value="New Customers">New Customers</SelectItem>
              <SelectItem value="At Risk">At Risk</SelectItem>
              <SelectItem value="Cannot Lose Them">Cannot Lose Them</SelectItem>
              <SelectItem value="Hibernating">Hibernating</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Analysis</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              <p className="text-sm text-gray-500">Active customer base</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Customer CLV</p>
              <p className="text-2xl font-bold text-green-600">₱{(avgClv / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-500">Lifetime value</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Champion Customers</p>
              <p className="text-2xl font-bold text-purple-600">{championsCount}</p>
              <p className="text-sm text-gray-500">High-value segment</p>
            </div>
            <Crown className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Loyalty Score</p>
              <p className="text-2xl font-bold text-orange-600">{avgLoyalty.toFixed(0)}%</p>
              <p className="text-sm text-gray-500">Customer loyalty</p>
            </div>
            <Heart className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rfm">RFM Analysis</TabsTrigger>
          <TabsTrigger value="clv">Customer Lifetime Value</TabsTrigger>
          <TabsTrigger value="segments">Segment Insights</TabsTrigger>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
        </TabsList>

        {/* RFM Analysis Tab */}
        <TabsContent value="rfm" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6">
              <h3 className="text-lg font-semibold mb-4">RFM Segmentation Matrix</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="frequency" 
                    name="Frequency" 
                    domain={[0, 16]}
                    label={{ value: 'Purchase Frequency', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="monetary" 
                    name="Monetary" 
                    domain={[0, 900000]}
                    tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}K`}
                    label={{ value: 'Monetary Value (₱)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<RFMTooltip />} />
                  
                  <Scatter name="Customers" data={filteredData}>
                    {filteredData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getSegmentColor(entry.segment)} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Segment Distribution</h3>
              <div className="space-y-4">
                {segmentDistribution.map((segment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{segment.segment}</span>
                      <span className="text-sm text-gray-600">{segment.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${segment.percentage}%`,
                          backgroundColor: segment.color
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{segment.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Segment Strategy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Champions</h4>
              </div>
              <p className="text-sm text-green-700 mb-2">12.5% • 38 customers</p>
              <p className="text-xs text-green-600">Strategy: Reward & retain with VIP programs</p>
            </Card>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Loyal Customers</h4>
              </div>
              <p className="text-sm text-blue-700 mb-2">23.7% • 72 customers</p>
              <p className="text-xs text-blue-600">Strategy: Upsell & cross-sell opportunities</p>
            </Card>

            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Potential Loyalists</h4>
              </div>
              <p className="text-sm text-purple-700 mb-2">28.0% • 85 customers</p>
              <p className="text-xs text-purple-600">Strategy: Increase engagement & frequency</p>
            </Card>

            <Card className="p-4 bg-red-50 border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-red-800">At Risk</h4>
              </div>
              <p className="text-sm text-red-700 mb-2">10.5% • 32 customers</p>
              <p className="text-xs text-red-600">Strategy: Win-back campaigns & special offers</p>
            </Card>
          </div>
        </TabsContent>

        {/* CLV Tab */}
        <TabsContent value="clv" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Lifetime Value Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={clvTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `₱${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value: any) => `₱${(value / 1000000).toFixed(1)}M`} />
                <Legend />
                <Line type="monotone" dataKey="champions" stroke="#10b981" name="Champions" strokeWidth={3} />
                <Line type="monotone" dataKey="loyal" stroke="#3b82f6" name="Loyal" strokeWidth={2} />
                <Line type="monotone" dataKey="potential" stroke="#8b5cf6" name="Potential" strokeWidth={2} />
                <Line type="monotone" dataKey="newCustomers" stroke="#f59e0b" name="New" strokeWidth={2} />
                <Line type="monotone" dataKey="atRisk" stroke="#ef4444" name="At Risk" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h4 className="font-semibold mb-4">CLV Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={segmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ segment, percentage }) => `${segment.split(' ')[0]} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {segmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-4">CLV Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total CLV</span>
                  <span className="font-semibold">₱{(rfmSegmentData.reduce((sum, c) => sum + c.clv, 0) / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg CLV</span>
                  <span className="font-semibold">₱{(avgClv / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CLV Growth</span>
                  <span className="font-semibold text-green-600">+12.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Top 20% CLV Share</span>
                  <span className="font-semibold">68%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-4">CLV Optimization</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-sm font-medium text-green-800">Increase Frequency</p>
                  <p className="text-xs text-green-600">+15% CLV potential through engagement</p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-sm font-medium text-blue-800">Retention Focus</p>
                  <p className="text-xs text-blue-600">Prevent 5% churn saves ₱2.1M CLV</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-sm font-medium text-purple-800">Upsell Champions</p>
                  <p className="text-xs text-purple-600">20% basket increase = ₱540K CLV</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Segment Insights Tab */}
        <TabsContent value="segments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Segment Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={segmentDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Segment Actions</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Champions & Loyal</h4>
                    <p className="text-sm text-green-600">Focus on retention and advocacy programs</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded">
                  <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Potential Loyalists</h4>
                    <p className="text-sm text-purple-600">Increase engagement with targeted campaigns</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded">
                  <Star className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">New Customers</h4>
                    <p className="text-sm text-orange-600">Onboarding and early relationship building</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">At Risk & Hibernating</h4>
                    <p className="text-sm text-red-600">Immediate intervention and win-back campaigns</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Cohort Analysis Tab */}
        <TabsContent value="cohort" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Retention Cohort Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium">Cohort</th>
                    <th className="pb-3 font-medium text-center">Month 1</th>
                    <th className="pb-3 font-medium text-center">Month 2</th>
                    <th className="pb-3 font-medium text-center">Month 3</th>
                    <th className="pb-3 font-medium text-center">Month 4</th>
                    <th className="pb-3 font-medium text-center">Month 5</th>
                    <th className="pb-3 font-medium text-center">Month 6</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((cohort, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-medium">{cohort.cohort}</td>
                      <td className="py-3 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-8 bg-green-100 text-green-800 rounded text-sm font-medium">
                          {cohort.month1}%
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-sm font-medium ${
                          cohort.month2 >= 85 ? 'bg-green-100 text-green-800' : 
                          cohort.month2 >= 75 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {cohort.month2}%
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-sm font-medium ${
                          cohort.month3 >= 75 ? 'bg-green-100 text-green-800' : 
                          cohort.month3 >= 65 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {cohort.month3}%
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-sm font-medium ${
                          cohort.month4 >= 70 ? 'bg-green-100 text-green-800' : 
                          cohort.month4 >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {cohort.month4}%
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-sm font-medium ${
                          cohort.month5 >= 65 ? 'bg-green-100 text-green-800' : 
                          cohort.month5 >= 55 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {cohort.month5}%
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <div className={`inline-flex items-center justify-center w-12 h-8 rounded text-sm font-medium ${
                          cohort.month6 >= 62 ? 'bg-green-100 text-green-800' : 
                          cohort.month6 >= 52 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {cohort.month6}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded">
                <p className="text-sm text-gray-600">6-Month Retention</p>
                <p className="text-2xl font-bold text-green-600">65%</p>
                <p className="text-xs text-gray-500">Average across cohorts</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <p className="text-sm text-gray-600">Best Performing</p>
                <p className="text-2xl font-bold text-blue-600">2024-05</p>
                <p className="text-xs text-gray-500">68% 6-month retention</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <p className="text-sm text-gray-600">Improvement</p>
                <p className="text-2xl font-bold text-purple-600">+3.2%</p>
                <p className="text-xs text-gray-500">vs previous period</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Recommendations */}
      <AIRecommendationPanel recommendations={recommendations} />
    </div>
  );
};

export default CustomerIntelligence;