
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useBrandPerformance, useFMCGCategories } from '@/hooks/useFMCGData';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Treemap, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Sankey } from 'recharts';
import { Package, TrendingUp, Repeat, ShoppingCart } from 'lucide-react';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

const ProductMix = () => {
  const { data: brandData, isLoading: brandLoading } = useBrandPerformance();
  const { data: categoryData, isLoading: categoryLoading } = useFMCGCategories();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const topCategories = categoryData?.slice(0, 4) || [];
  const topBrands = brandData?.slice(0, 3) || [];

  // Mock data for SKU details
  const skuData = [
    { category: 'Beverages', sku: 'Coke 8oz', units: 1250, revenue: 31250 },
    { category: 'Beverages', sku: 'Sprite 8oz', units: 890, revenue: 22250 },
    { category: 'Snacks', sku: 'Chippy 25g', units: 2100, revenue: 42000 },
    { category: 'Personal Care', sku: 'Safeguard 135g', units: 650, revenue: 32500 },
    { category: 'Tobacco', sku: 'Marlboro Red', units: 3200, revenue: 352000 },
  ];

  // Mock data for substitution patterns
  const substitutionData = [
    { from: 'Palmolive', to: 'Safeguard', count: 120 },
    { from: 'Coke', to: 'Pepsi', count: 85 },
    { from: 'Marlboro', to: 'Fortune', count: 200 },
    { from: 'Chippy', to: 'Piattos', count: 150 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Product Mix & SKU Info</h1>
        <div className="flex gap-3">
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
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="ncr">NCR</SelectItem>
              <SelectItem value="luzon">Luzon</SelectItem>
              <SelectItem value="visayas">Visayas</SelectItem>
              <SelectItem value="mindanao">Mindanao</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Category Volume</h3>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-blue-600">8 Categories</p>
          <p className="text-sm text-gray-500">156 active SKUs</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Top SKU</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-green-600">Marlboro Red</p>
          <p className="text-sm text-gray-500">₱352K revenue</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Substitutions</h3>
            <Repeat className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-purple-600">555</p>
          <p className="text-sm text-gray-500">This month</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg Bundle Size</h3>
            <ShoppingCart className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-orange-600">2.8 items</p>
          <p className="text-sm text-gray-500">Per transaction</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category & Brand Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skuData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sku" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="units" fill="#3b82f6" />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top SKUs per Category</h3>
          <div className="space-y-4">
            {skuData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{item.sku}</p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱{(item.revenue / 1000).toFixed(1)}K</p>
                  <p className="text-sm text-gray-600">{item.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Brand Substitution Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-medium mb-3">Top Substitutions</h4>
            <div className="space-y-2">
              {substitutionData.map((sub, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{sub.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium">{sub.to}</span>
                  </div>
                  <span className="text-sm text-blue-600">{sub.count} times</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-md font-medium mb-3">Usually Bought Together</h4>
            <div className="space-y-2">
              <div className="p-2 bg-blue-50 rounded">
                <p className="text-sm font-medium">Yosi + Max Coffee</p>
                <p className="text-xs text-gray-600">78% of tobacco buyers</p>
              </div>
              <div className="p-2 bg-green-50 rounded">
                <p className="text-sm font-medium">Coke + Chippy</p>
                <p className="text-xs text-gray-600">65% of beverage buyers</p>
              </div>
              <div className="p-2 bg-purple-50 rounded">
                <p className="text-sm font-medium">Shampoo + Soap</p>
                <p className="text-xs text-gray-600">45% of personal care buyers</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <AIRecommendationPanel context="product-mix" />
    </div>
  );
};

export default ProductMix;
