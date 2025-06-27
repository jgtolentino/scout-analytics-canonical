
import React from 'react';
import { Card } from '@/components/ui/card';
import { useRegionalPerformance, useBrandPerformance, useClientBrands } from '@/hooks/useFMCGData';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, ShoppingBag, Store, DollarSign, Package, Users, MapPin, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Overview = () => {
  const { data: regionalData, isLoading: regionalLoading } = useRegionalPerformance();
  const { data: brandData, isLoading: brandLoading } = useBrandPerformance();
  const { data: clientBrands, isLoading: brandsLoading } = useClientBrands();

  // Updated to show 52,101 transactions as per actual data
  const totalSales = 20200000; // ₱20.2M as per spec
  const totalTransactions = 52101; // Actual transaction count
  const activeStores = 138; // Actual store count
  const avgTransactionValue = totalSales / totalTransactions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Scout Analytics Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-blue-600">₱{(totalSales / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600 mt-1">+12% vs last month</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <ShoppingBag className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-green-600">{totalTransactions.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">Daily average</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-gray-600">Active Stores</p>
                <Store className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-purple-600">{activeStores}</p>
              <p className="text-xs text-gray-600 mt-1">Across 17 regions</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-orange-600">₱{avgTransactionValue.toFixed(0)}</p>
              <p className="text-xs text-green-600 mt-1">+₱15 vs last month</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Regions by Sales</h3>
          <div className="space-y-3">
            {regionalLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              regionalData?.slice(0, 3).map((region) => (
                <div key={region.region_name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{region.region_name}</span>
                  <span className="text-sm font-medium">₱{(region.total_sales / 1000).toFixed(0)}K</span>
                </div>
              ))
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Client Brands</h3>
          <div className="space-y-3">
            {brandsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              clientBrands?.slice(0, 5).map((brand) => (
                <div key={brand.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{brand.brand_name}</span>
                  <span className="text-sm font-medium">{brand.category}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sales Trend - Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={[
            { day: 'Mon', sales: 2.8 },
            { day: 'Tue', sales: 2.9 },
            { day: 'Wed', sales: 3.1 },
            { day: 'Thu', sales: 2.7 },
            { day: 'Fri', sales: 3.3 },
            { day: 'Sat', sales: 3.5 },
            { day: 'Sun', sales: 3.2 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => `₱${value}M`} />
            <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="#93bbfc" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Top Categories</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Tobacco</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Beverages</span>
              <span className="text-sm font-medium">28%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Snacks</span>
              <span className="text-sm font-medium">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Personal Care</span>
              <span className="text-sm font-medium">17%</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Demographics</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">18-34 years</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">35-54 years</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">55+ years</span>
              <span className="text-sm font-medium">20%</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Store Types</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sari-sari Store</span>
              <span className="text-sm font-medium">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Mini Mart</span>
              <span className="text-sm font-medium">15%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Convenience</span>
              <span className="text-sm font-medium">7%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
