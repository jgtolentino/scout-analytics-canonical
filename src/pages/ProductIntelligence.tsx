import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Star, AlertTriangle, Package, DollarSign, ShoppingCart, Target, Info } from 'lucide-react';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

// BCG Matrix data - products plotted by market share (x) and growth rate (y)
const bcgMatrixData = [
  // Stars (High Growth, High Share)
  { name: 'Coke 1.5L', marketShare: 28, growthRate: 22, revenue: 3200000, category: 'Beverages', quadrant: 'star' },
  { name: 'Palmolive Shampoo', marketShare: 25, growthRate: 18, revenue: 2800000, category: 'Personal Care', quadrant: 'star' },
  { name: 'Lucky Me Pancit Canton', marketShare: 35, growthRate: 15, revenue: 2500000, category: 'Instant Noodles', quadrant: 'star' },
  
  // Cash Cows (Low Growth, High Share)
  { name: 'Marlboro Red', marketShare: 42, growthRate: 3, revenue: 4500000, category: 'Tobacco', quadrant: 'cashcow' },
  { name: 'Tanduay Rhum', marketShare: 38, growthRate: 5, revenue: 3800000, category: 'Alcohol', quadrant: 'cashcow' },
  { name: 'Alaska Evap', marketShare: 30, growthRate: 2, revenue: 2200000, category: 'Dairy', quadrant: 'cashcow' },
  
  // Question Marks (High Growth, Low Share)
  { name: 'Organic Shampoo', marketShare: 8, growthRate: 35, revenue: 450000, category: 'Personal Care', quadrant: 'question' },
  { name: 'Energy Drinks', marketShare: 12, growthRate: 28, revenue: 680000, category: 'Beverages', quadrant: 'question' },
  { name: 'Vape Products', marketShare: 6, growthRate: 45, revenue: 320000, category: 'Tobacco', quadrant: 'question' },
  
  // Dogs (Low Growth, Low Share)
  { name: 'Local Soap', marketShare: 5, growthRate: -2, revenue: 180000, category: 'Personal Care', quadrant: 'dog' },
  { name: 'Generic Biscuits', marketShare: 7, growthRate: 1, revenue: 220000, category: 'Snacks', quadrant: 'dog' },
  { name: 'Paper Napkins', marketShare: 4, growthRate: -5, revenue: 120000, category: 'Household', quadrant: 'dog' },
];

// Product lifecycle data
const lifecycleData = [
  { stage: 'Introduction', products: 12, revenue: 850000, growth: 45 },
  { stage: 'Growth', products: 28, revenue: 5200000, growth: 25 },
  { stage: 'Maturity', products: 45, revenue: 12300000, growth: 5 },
  { stage: 'Decline', products: 8, revenue: 980000, growth: -15 },
];

// SKU performance data
const skuPerformance = [
  { sku: 'COK-1.5L-PET', name: 'Coke 1.5L', velocity: 92, stockTurn: 24, margin: 18, contribution: 580000 },
  { sku: 'MAR-RED-20S', name: 'Marlboro Red', velocity: 88, stockTurn: 18, margin: 22, contribution: 990000 },
  { sku: 'PAL-SHM-12ML', name: 'Palmolive Shampoo', velocity: 85, stockTurn: 20, margin: 25, contribution: 700000 },
  { sku: 'LME-PAN-80G', name: 'Lucky Me Pancit', velocity: 95, stockTurn: 30, margin: 15, contribution: 375000 },
  { sku: 'TAN-RHM-700ML', name: 'Tanduay Rhum', velocity: 78, stockTurn: 12, margin: 28, contribution: 1064000 },
  { sku: 'ALA-EVP-370ML', name: 'Alaska Evap', velocity: 82, stockTurn: 22, margin: 12, contribution: 264000 },
];

// Category performance radar data
const categoryRadarData = [
  { category: 'Velocity', beverages: 85, personalCare: 78, tobacco: 72, snacks: 88, dairy: 75 },
  { category: 'Margin', beverages: 18, personalCare: 22, tobacco: 25, snacks: 15, dairy: 12 },
  { category: 'Growth', beverages: 15, personalCare: 12, tobacco: 3, snacks: 18, dairy: 5 },
  { category: 'Market Share', beverages: 25, personalCare: 20, tobacco: 35, snacks: 15, dairy: 18 },
  { category: 'Innovation', beverages: 70, personalCare: 85, tobacco: 45, snacks: 60, dairy: 40 },
];

const ProductIntelligence = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuadrant, setSelectedQuadrant] = useState('all');
  const [activeTab, setActiveTab] = useState('bcg');

  // Filter BCG data
  const filteredBCGData = bcgMatrixData.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedQuadrant !== 'all' && item.quadrant !== selectedQuadrant) return false;
    return true;
  });

  // Custom tooltip for BCG Matrix
  const BCGTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded shadow-lg border">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">{data.category}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p>Market Share: {data.marketShare}%</p>
            <p>Growth Rate: {data.growthRate}%</p>
            <p>Revenue: ₱{(data.revenue / 1000000).toFixed(1)}M</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Quadrant colors
  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'star': return '#10b981'; // Green
      case 'cashcow': return '#3b82f6'; // Blue
      case 'question': return '#f59e0b'; // Orange
      case 'dog': return '#ef4444'; // Red
      default: return '#6b7280';
    }
  };

  // Calculate metrics
  const totalProducts = bcgMatrixData.length;
  const avgGrowthRate = bcgMatrixData.reduce((sum, p) => sum + p.growthRate, 0) / totalProducts;
  const totalRevenue = bcgMatrixData.reduce((sum, p) => sum + p.revenue, 0);
  const starsCount = bcgMatrixData.filter(p => p.quadrant === 'star').length;

  const recommendations = [
    {
      id: 1,
      title: 'Invest in Stars',
      description: 'Coke 1.5L and Palmolive showing strong growth. Increase inventory and promotional support.',
      priority: 'high' as const,
      metric: '3 star products',
    },
    {
      id: 2,
      title: 'Optimize Cash Cows',
      description: 'Marlboro and Tanduay generate 35% of revenue. Maintain stock levels and margins.',
      priority: 'medium' as const,
      metric: '₱8.3M revenue',
    },
    {
      id: 3,
      title: 'Evaluate Question Marks',
      description: 'Energy drinks showing 28% growth but low share. Consider targeted promotions.',
      priority: 'medium' as const,
      metric: '45% growth potential',
    },
    {
      id: 4,
      title: 'Phase Out Dogs',
      description: 'Generic biscuits and paper napkins underperforming. Consider SKU rationalization.',
      priority: 'low' as const,
      metric: '3 products',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Intelligence</h1>
          <p className="text-gray-600 mt-1">BCG Matrix, lifecycle analysis, and SKU optimization</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Beverages">Beverages</SelectItem>
              <SelectItem value="Personal Care">Personal Care</SelectItem>
              <SelectItem value="Tobacco">Tobacco</SelectItem>
              <SelectItem value="Snacks">Snacks</SelectItem>
              <SelectItem value="Dairy">Dairy</SelectItem>
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
              <p className="text-sm text-gray-600">Total SKUs</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              <p className="text-sm text-gray-500">Active products</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Star Products</p>
              <p className="text-2xl font-bold text-green-600">{starsCount}</p>
              <p className="text-sm text-gray-500">High growth & share</p>
            </div>
            <Star className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{avgGrowthRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Portfolio growth</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue Impact</p>
              <p className="text-2xl font-bold text-gray-900">₱{(totalRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-500">Total contribution</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bcg">BCG Matrix</TabsTrigger>
          <TabsTrigger value="lifecycle">Product Lifecycle</TabsTrigger>
          <TabsTrigger value="sku">SKU Analysis</TabsTrigger>
          <TabsTrigger value="category">Category Performance</TabsTrigger>
        </TabsList>

        {/* BCG Matrix Tab */}
        <TabsContent value="bcg" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Product Performance Matrix</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50">
                  <Star className="h-3 w-3 mr-1" />
                  Stars
                </Badge>
                <Badge variant="outline" className="bg-blue-50">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Cash Cows
                </Badge>
                <Badge variant="outline" className="bg-orange-50">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Question Marks
                </Badge>
                <Badge variant="outline" className="bg-red-50">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Dogs
                </Badge>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  dataKey="marketShare" 
                  name="Market Share" 
                  unit="%" 
                  domain={[0, 50]}
                  label={{ value: 'Relative Market Share (%)', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="growthRate" 
                  name="Growth Rate" 
                  unit="%" 
                  domain={[-10, 50]}
                  label={{ value: 'Market Growth Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<BCGTooltip />} />
                
                {/* Reference lines for quadrants */}
                <ReferenceLine x={20} stroke="#666" strokeDasharray="5 5" />
                <ReferenceLine y={10} stroke="#666" strokeDasharray="5 5" />
                
                {/* Quadrant labels */}
                <text x="35%" y="15%" textAnchor="middle" fill="#10b981" fontSize="14" fontWeight="bold">
                  STARS
                </text>
                <text x="35%" y="85%" textAnchor="middle" fill="#3b82f6" fontSize="14" fontWeight="bold">
                  CASH COWS
                </text>
                <text x="10%" y="15%" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="bold">
                  QUESTION MARKS
                </text>
                <text x="10%" y="85%" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">
                  DOGS
                </text>
                
                <Scatter name="Products" data={filteredBCGData}>
                  {filteredBCGData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getQuadrantColor(entry.quadrant)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Quadrant Summary */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-green-50 rounded">
                <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold">Stars</h4>
                <p className="text-2xl font-bold text-green-600 my-2">
                  {bcgMatrixData.filter(p => p.quadrant === 'star').length}
                </p>
                <p className="text-sm text-gray-600">High growth, High share</p>
                <p className="text-xs text-gray-500 mt-1">Invest for growth</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded">
                <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">Cash Cows</h4>
                <p className="text-2xl font-bold text-blue-600 my-2">
                  {bcgMatrixData.filter(p => p.quadrant === 'cashcow').length}
                </p>
                <p className="text-sm text-gray-600">Low growth, High share</p>
                <p className="text-xs text-gray-500 mt-1">Maintain & milk</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded">
                <AlertTriangle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold">Question Marks</h4>
                <p className="text-2xl font-bold text-orange-600 my-2">
                  {bcgMatrixData.filter(p => p.quadrant === 'question').length}
                </p>
                <p className="text-sm text-gray-600">High growth, Low share</p>
                <p className="text-xs text-gray-500 mt-1">Selective investment</p>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded">
                <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
                <h4 className="font-semibold">Dogs</h4>
                <p className="text-2xl font-bold text-red-600 my-2">
                  {bcgMatrixData.filter(p => p.quadrant === 'dog').length}
                </p>
                <p className="text-sm text-gray-600">Low growth, Low share</p>
                <p className="text-xs text-gray-500 mt-1">Divest or discontinue</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Product Lifecycle Tab */}
        <TabsContent value="lifecycle" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Products by Lifecycle Stage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={lifecycleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="products" fill="#3b82f6" name="Product Count" />
                  <Bar dataKey="growth" fill="#10b981" name="Growth %" yAxisId="right" />
                  <YAxis yAxisId="right" orientation="right" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Lifecycle Stage</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lifecycleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₱${(value as number / 1000000).toFixed(1)}M`} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lifecycle Stage Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-purple-50 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  <h4 className="font-medium">Introduction</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">12 products</p>
                <p className="text-xs text-gray-500">Focus on awareness & trial. Monitor early adoption rates.</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                  <h4 className="font-medium">Growth</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">28 products</p>
                <p className="text-xs text-gray-500">Maximize distribution. Invest in inventory & promotion.</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <h4 className="font-medium">Maturity</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">45 products</p>
                <p className="text-xs text-gray-500">Optimize costs. Defend market share. Consider variants.</p>
              </div>
              
              <div className="p-4 bg-red-50 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full" />
                  <h4 className="font-medium">Decline</h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">8 products</p>
                <p className="text-xs text-gray-500">Phase out slowly. Clear inventory. Replace with new SKUs.</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* SKU Analysis Tab */}
        <TabsContent value="sku" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Performing SKUs</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium">SKU Code</th>
                    <th className="pb-3 font-medium">Product Name</th>
                    <th className="pb-3 font-medium text-center">Velocity</th>
                    <th className="pb-3 font-medium text-center">Stock Turn</th>
                    <th className="pb-3 font-medium text-center">Margin %</th>
                    <th className="pb-3 font-medium text-right">Contribution</th>
                    <th className="pb-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {skuPerformance.map((sku, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 font-mono text-sm">{sku.sku}</td>
                      <td className="py-3">{sku.name}</td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${sku.velocity}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm">{sku.velocity}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">{sku.stockTurn}x</td>
                      <td className="py-3 text-center">
                        <Badge variant={sku.margin > 20 ? 'default' : 'secondary'}>
                          {sku.margin}%
                        </Badge>
                      </td>
                      <td className="py-3 text-right font-medium">
                        ₱{sku.contribution.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <Button size="sm" variant="outline">Analyze</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h4 className="font-semibold mb-3">SKU Rationalization</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total SKUs</span>
                  <span className="font-medium">486</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Top 20% Contributing</span>
                  <span className="font-medium text-green-600">78% revenue</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bottom 20% Contributing</span>
                  <span className="font-medium text-red-600">2% revenue</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Consider removing 42 low-performing SKUs</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-3">Inventory Efficiency</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Stock Turn</span>
                  <span className="font-medium">18.5x/year</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Days of Inventory</span>
                  <span className="font-medium">19.7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stockout Rate</span>
                  <span className="font-medium text-orange-600">3.2%</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Optimize reorder points for fast movers</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-semibold mb-3">Margin Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Product Margin</span>
                  <span className="font-medium">19.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">High Margin SKUs</span>
                  <span className="font-medium text-green-600">23% of total</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Margin Improvement</span>
                  <span className="font-medium text-blue-600">+2.3% YoY</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-sm text-gray-600">Focus on premium SKU placement</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Category Performance Tab */}
        <TabsContent value="category" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Category Performance Radar</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={categoryRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Beverages" dataKey="beverages" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="Personal Care" dataKey="personalCare" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Radar name="Tobacco" dataKey="tobacco" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Category Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <ShoppingCart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Beverages Leading</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Highest velocity (85) and growth (15%). Coke 1.5L driving category performance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Personal Care Innovation</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Highest innovation score (85). Organic products showing 35% growth potential.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Tobacco Stability</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Highest margin (25%) but lowest growth (3%). Focus on maintaining share.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Info className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Snacks Opportunity</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Highest growth potential (18%) with room for premium SKU introduction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Category Mix Optimization</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['Beverages', 'Personal Care', 'Tobacco', 'Snacks', 'Dairy'].map((category, index) => {
                const colors = ['blue', 'green', 'orange', 'purple', 'pink'];
                const color = colors[index];
                return (
                  <div key={category} className={`text-center p-4 bg-${color}-50 rounded`}>
                    <h4 className="font-medium mb-2">{category}</h4>
                    <p className="text-2xl font-bold mb-1">
                      {[25, 20, 18, 22, 15][index]}%
                    </p>
                    <p className="text-sm text-gray-600">of revenue</p>
                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>SKUs:</span>
                        <span className="font-medium">{[86, 72, 45, 94, 58][index]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Velocity:</span>
                        <span className="font-medium">{[85, 78, 72, 88, 75][index]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Recommendations */}
      <AIRecommendationPanel recommendations={recommendations} />
    </div>
  );
};

export default ProductIntelligence;