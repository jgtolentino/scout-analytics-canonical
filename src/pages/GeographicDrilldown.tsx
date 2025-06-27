import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiLevelPhilippinesMap } from '@/components/maps/MultiLevelPhilippinesMap';
import { getAggregatedData, searchLocations } from '@/services/geoDataService';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, MapPin, TrendingUp, Store, Package, Users, DollarSign, Target, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

const GeographicDrilldown = () => {
  const [selectedMetric, setSelectedMetric] = useState<'sales' | 'stores' | 'transactions' | 'growth'>('sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState<any>(null);

  // Sample data for visualizations
  const performanceByLevel = [
    { level: 'National', sales: 20200000, stores: 138, transactions: 52101 },
    { level: 'Regional Avg', sales: 1188235, stores: 8, transactions: 3065 },
    { level: 'Provincial Avg', sales: 249382, stores: 2, transactions: 643 },
    { level: 'City/Muni Avg', sales: 13553, stores: 1, transactions: 35 },
  ];

  const topPerformingAreas = [
    { name: 'NCR', type: 'Region', sales: 9447000, growth: 15.2 },
    { name: 'Quezon City', type: 'City', sales: 3200000, growth: 12.5 },
    { name: 'CALABARZON', type: 'Region', sales: 2086000, growth: 8.9 },
    { name: 'Makati', type: 'City', sales: 2800000, growth: 15.3 },
    { name: 'Central Luzon', type: 'Region', sales: 1985000, growth: 7.4 },
  ];

  const expansionOpportunities = [
    { area: 'Davao Region', potential: 'High', reason: 'Low store density, high population' },
    { area: 'Northern Mindanao', potential: 'High', reason: 'Growing economy, urbanization' },
    { area: 'Eastern Visayas', potential: 'Medium', reason: 'Untapped rural markets' },
    { area: 'SOCCSKSARGEN', potential: 'Medium', reason: 'Agricultural hub potential' },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchLocations(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // AI Recommendations
  const recommendations = [
    {
      id: 1,
      title: 'Metro Manila Saturation',
      description: 'NCR has 45 stores (32.6% of total) but consider expanding to underserved provinces.',
      priority: 'high' as const,
      metric: '45 stores in NCR',
    },
    {
      id: 2,
      title: 'Mindanao Expansion',
      description: 'Davao and Northern Mindanao show high growth potential with only 8 stores combined.',
      priority: 'medium' as const,
      metric: '8 stores total',
    },
    {
      id: 3,
      title: 'Provincial Cities Focus',
      description: 'Secondary cities in Visayas showing 12%+ growth rates. Priority expansion targets.',
      priority: 'medium' as const,
      metric: '+12% growth',
    },
    {
      id: 4,
      title: 'Supply Chain Optimization',
      description: 'Consider regional distribution hubs in Central Luzon and CALABARZON.',
      priority: 'low' as const,
      metric: 'Reduce costs 15%',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Geographic Deep Dive</h1>
          <p className="text-gray-600 mt-1">Multi-level analysis from regions to municipalities</p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-64"
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {searchResults.map((result, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                onClick={() => setSelectedArea(result)}
              >
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{result.type}</p>
                </div>
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Coverage</p>
              <p className="text-2xl font-bold">17/17</p>
              <p className="text-sm text-gray-500">Regions with stores</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Store Density</p>
              <p className="text-2xl font-bold">8.1</p>
              <p className="text-sm text-gray-500">Stores per region</p>
            </div>
            <Store className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urban vs Rural</p>
              <p className="text-2xl font-bold">72/28</p>
              <p className="text-sm text-gray-500">Store distribution %</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expansion Potential</p>
              <p className="text-2xl font-bold">324</p>
              <p className="text-sm text-gray-500">Untapped cities</p>
            </div>
            <Target className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="map" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="opportunities">Expansion Opportunities</TabsTrigger>
          <TabsTrigger value="insights">Regional Insights</TabsTrigger>
        </TabsList>

        {/* Interactive Map Tab */}
        <TabsContent value="map" className="space-y-4">
          <MultiLevelPhilippinesMap 
            metric={selectedMetric}
            onAreaSelect={(areaCode, level) => {
              console.log('Selected:', areaCode, level);
            }}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Luzon', value: 65 },
                      { name: 'Visayas', value: 20 },
                      { name: 'Mindanao', value: 15 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                    Luzon (90 stores)
                  </span>
                  <span className="font-medium">₱13.2M sales</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                    Visayas (28 stores)
                  </span>
                  <span className="font-medium">₱4.0M sales</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2" />
                    Mindanao (20 stores)
                  </span>
                  <span className="font-medium">₱3.0M sales</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Store Density Heatmap</h3>
              <div className="space-y-3">
                {[
                  { region: 'NCR', density: 45, color: 'bg-red-500' },
                  { region: 'CALABARZON', density: 28, color: 'bg-orange-500' },
                  { region: 'Central Luzon', density: 32, color: 'bg-orange-400' },
                  { region: 'Western Visayas', density: 10, color: 'bg-yellow-500' },
                  { region: 'Davao Region', density: 5, color: 'bg-green-500' },
                  { region: 'Northern Mindanao', density: 3, color: 'bg-green-400' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.region}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-4">
                        <div 
                          className={`h-4 rounded-full ${item.color}`}
                          style={{ width: `${(item.density / 45) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">{item.density}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Analysis Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Performance by Administrative Level</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceByLevel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₱${(value as number).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Performing Areas</h3>
              <div className="space-y-3">
                {topPerformingAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{area.name}</p>
                        <p className="text-sm text-gray-600">{area.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₱{(area.sales / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-green-600">+{area.growth}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Regional Growth Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { month: 'Jan', luzon: 85, visayas: 78, mindanao: 72 },
                { month: 'Feb', luzon: 88, visayas: 80, mindanao: 74 },
                { month: 'Mar', luzon: 92, visayas: 82, mindanao: 78 },
                { month: 'Apr', luzon: 90, visayas: 85, mindanao: 80 },
                { month: 'May', luzon: 95, visayas: 88, mindanao: 85 },
                { month: 'Jun', luzon: 98, visayas: 92, mindanao: 88 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="luzon" stroke="#3b82f6" name="Luzon" strokeWidth={2} />
                <Line type="monotone" dataKey="visayas" stroke="#10b981" name="Visayas" strokeWidth={2} />
                <Line type="monotone" dataKey="mindanao" stroke="#f59e0b" name="Mindanao" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Expansion Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">High Potential Areas</h3>
              <div className="space-y-3">
                {expansionOpportunities.map((opp, index) => (
                  <div key={index} className="border rounded p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{opp.area}</h4>
                        <p className="text-sm text-gray-600 mt-1">{opp.reason}</p>
                      </div>
                      <Badge 
                        variant={opp.potential === 'High' ? 'default' : 'secondary'}
                        className={opp.potential === 'High' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {opp.potential} Potential
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Market Penetration Analysis</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Metro Manila</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Major Cities</span>
                    <span className="font-medium">62%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Provincial Cities</span>
                    <span className="font-medium">38%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rural Areas</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-300 h-2 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">Expansion Opportunity</p>
                    <p className="text-sm text-orange-700">324 cities without Scout presence</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recommended Expansion Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <h4 className="font-medium mb-2">Phase 1: Major Cities</h4>
                <p className="text-sm text-gray-600">Target provincial capitals in Mindanao (Q1-Q2)</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-green-600">2</span>
                </div>
                <h4 className="font-medium mb-2">Phase 2: Secondary Cities</h4>
                <p className="text-sm text-gray-600">Expand to high-growth municipalities (Q3-Q4)</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-medium mb-2">Phase 3: Rural Hubs</h4>
                <p className="text-sm text-gray-600">Strategic rural distribution points (Next year)</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Regional Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Luzon Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Population Coverage</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Store Performance</span>
                  <span className="font-medium text-green-600">+12.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Market Share</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="mt-3 p-3 bg-blue-50 rounded">
                  <p className="text-sm">
                    <strong>Key Insight:</strong> NCR saturation driving expansion to nearby provinces. CALABARZON showing highest growth.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Visayas Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Population Coverage</span>
                  <span className="font-medium">52%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Store Performance</span>
                  <span className="font-medium text-green-600">+8.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Market Share</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="mt-3 p-3 bg-green-50 rounded">
                  <p className="text-sm">
                    <strong>Key Insight:</strong> Cebu City cluster performing well. Opportunity in secondary islands like Bohol and Negros.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mindanao Insights</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Population Coverage</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg Store Performance</span>
                  <span className="font-medium text-green-600">+15.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Market Share</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="mt-3 p-3 bg-orange-50 rounded">
                  <p className="text-sm">
                    <strong>Key Insight:</strong> Highest growth potential. Davao and CDO markets underserved. Rural distribution challenge.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Supply Chain Efficiency by Region</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { region: 'NCR', efficiency: 92, cost: 12 },
                { region: 'Central Luzon', efficiency: 88, cost: 15 },
                { region: 'CALABARZON', efficiency: 85, cost: 16 },
                { region: 'Western Visayas', efficiency: 78, cost: 22 },
                { region: 'Central Visayas', efficiency: 75, cost: 24 },
                { region: 'Davao Region', efficiency: 70, cost: 28 },
                { region: 'Northern Mindanao', efficiency: 68, cost: 30 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="efficiency" fill="#3b82f6" name="Efficiency %" />
                <Bar yAxisId="right" dataKey="cost" fill="#ef4444" name="Cost per Delivery" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Recommendations */}
      <AIRecommendationPanel recommendations={recommendations} />
    </div>
  );
};

export default GeographicDrilldown;