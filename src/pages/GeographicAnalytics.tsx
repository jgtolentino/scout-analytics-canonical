import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { PhilippinesMap } from '@/components/maps/PhilippinesMap';
import { regionalSalesData } from '@/data/philippinesRegions';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MapPin, TrendingUp, Store, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GeographicAnalytics = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');

  // Transform data for charts
  const regionChartData = Object.entries(regionalSalesData)
    .map(([code, data]) => ({
      region: code,
      sales: data.sales / 1000000,
      stores: data.stores,
      transactions: data.transactions,
      growth: data.growth
    }))
    .sort((a, b) => b.sales - a.sales);

  // Top 5 regions for pie chart
  const topRegions = regionChartData.slice(0, 5);
  const pieData = topRegions.map(r => ({
    name: r.region,
    value: r.sales
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Geographic Analytics</h1>
        <div className="flex gap-3">
          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="map">Map View</SelectItem>
              <SelectItem value="table">Table View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Regions</h3>
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600">17</p>
          <p className="text-sm text-gray-500">Nationwide coverage</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Top Region</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-green-600">NCR</p>
          <p className="text-sm text-gray-500">₱9.4M sales</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Stores</h3>
            <Store className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600">138</p>
          <p className="text-sm text-gray-500">Active locations</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Coverage Rate</h3>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-orange-600">82%</p>
          <p className="text-sm text-gray-500">Of target regions</p>
        </Card>
      </div>

      {/* Map or Table View */}
      {viewMode === 'map' ? (
        <PhilippinesMap 
          showStores={true}
          onRegionClick={setSelectedRegion}
        />
      ) : (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Regional Performance Table</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stores</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg/Store</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionChartData.map((region) => (
                  <tr key={region.region} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.region}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₱{region.sales.toFixed(1)}M</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{region.stores}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{region.transactions.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₱{((region.sales * 1000000) / region.stores / 1000).toFixed(0)}K
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${region.growth > 10 ? 'text-green-600' : region.growth > 5 ? 'text-blue-600' : 'text-gray-600'}`}>
                        +{region.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Regional Sales Ranking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionChartData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip formatter={(value: any) => `₱${value}M`} />
              <Bar dataKey="sales" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top 5 Regions by Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => `₱${value}M`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Growth Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Regional Growth Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={regionChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="growth" stroke="#10b981" name="Growth %" />
            <Line type="monotone" dataKey="stores" stroke="#8b5cf6" name="Store Count" yAxisId="right" />
            <YAxis yAxisId="right" orientation="right" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Regional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Expansion Opportunities</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded">
              <p className="font-medium text-green-800">Region IV-A (CALABARZON)</p>
              <p className="text-sm text-green-600">High growth (18.2%) with room for 8 more stores</p>
            </div>
            <div className="p-3 bg-blue-50 rounded">
              <p className="font-medium text-blue-800">Region VII (Central Visayas)</p>
              <p className="text-sm text-blue-600">Highest growth (22.3%) - expand existing stores</p>
            </div>
            <div className="p-3 bg-purple-50 rounded">
              <p className="font-medium text-purple-800">Region III (Central Luzon)</p>
              <p className="text-sm text-purple-600">Strong performance with 15.3% growth</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Underperforming Regions</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded">
              <p className="font-medium text-red-800">BARMM</p>
              <p className="text-sm text-red-600">Only 0.9% growth - needs intervention</p>
            </div>
            <div className="p-3 bg-orange-50 rounded">
              <p className="font-medium text-orange-800">Region IX (Zamboanga)</p>
              <p className="text-sm text-orange-600">1.2% growth - review strategy</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded">
              <p className="font-medium text-yellow-800">Region IV-B (MIMAROPA)</p>
              <p className="text-sm text-yellow-600">2.1% growth - potential for improvement</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Regional Highlights</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Highest Sales/Store</span>
              <span className="text-sm font-medium">NCR (₱210K)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Most Stores</span>
              <span className="text-sm font-medium">NCR (45)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Fastest Growing</span>
              <span className="text-sm font-medium">Region VII (22.3%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Highest Transactions</span>
              <span className="text-sm font-medium">NCR (15,000)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeographicAnalytics;