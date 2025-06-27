import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Store, TrendingUp, TrendingDown, Package, Users, Clock, AlertTriangle, CheckCircle, XCircle, DollarSign, ShoppingCart, Target } from 'lucide-react';
import { AIRecommendationPanel } from '@/components/ai/AIRecommendationPanel';

// Individual store data
const storeData = {
  id: 'STR-045',
  name: 'Store #45 - Makati Central',
  region: 'NCR',
  manager: 'Juan Dela Cruz',
  established: '2021-03-15',
  size: '120 sqm',
  type: 'Type A - Premium',
  status: 'active',
};

// Store KPIs
const storeKPIs = {
  revenue: 892000,
  revenueGrowth: 15.2,
  transactions: 2304,
  avgBasket: 387,
  inventory: 85,
  stockouts: 3,
  customerSatisfaction: 4.5,
  rankRegional: 2,
  rankNational: 12,
};

// Store performance over time
const performanceTrend = [
  { month: 'Jan', revenue: 720000, transactions: 1860, avgBasket: 387 },
  { month: 'Feb', revenue: 765000, transactions: 1920, avgBasket: 398 },
  { month: 'Mar', revenue: 812000, transactions: 2100, avgBasket: 386 },
  { month: 'Apr', revenue: 798000, transactions: 2050, avgBasket: 389 },
  { month: 'May', revenue: 845000, transactions: 2180, avgBasket: 388 },
  { month: 'Jun', revenue: 892000, transactions: 2304, avgBasket: 387 },
];

// Product performance by store
const productPerformance = [
  { product: 'Palmolive Shampoo', sales: 42500, units: 850, stockLevel: 92, velocity: 'High' },
  { product: 'Coke 1.5L', sales: 38200, units: 1273, stockLevel: 78, velocity: 'High' },
  { product: 'Lucky Me Pancit Canton', sales: 35600, units: 2967, stockLevel: 65, velocity: 'Very High' },
  { product: 'Safeguard Soap', sales: 28900, units: 1445, stockLevel: 88, velocity: 'High' },
  { product: 'Alaska Evap Milk', sales: 26700, units: 890, stockLevel: 45, velocity: 'Medium' },
  { product: 'Chippy BBQ', sales: 24300, units: 1215, stockLevel: 82, velocity: 'High' },
  { product: 'Tide Powder 1kg', sales: 22100, units: 442, stockLevel: 70, velocity: 'Medium' },
  { product: 'Nescafe 3-in-1', sales: 19800, units: 1320, stockLevel: 90, velocity: 'High' },
];

// Inventory metrics
const inventoryMetrics = [
  { category: 'Personal Care', skus: 156, stockValue: 285000, turnover: 4.2, stockoutRisk: 'Low' },
  { category: 'Beverages', skus: 134, stockValue: 242000, turnover: 5.8, stockoutRisk: 'Medium' },
  { category: 'Snacks', skus: 178, stockValue: 198000, turnover: 6.2, stockoutRisk: 'Low' },
  { category: 'Household', skus: 98, stockValue: 165000, turnover: 3.5, stockoutRisk: 'Low' },
  { category: 'Dairy', skus: 45, stockValue: 132000, turnover: 7.1, stockoutRisk: 'High' },
];

// Store comparison radar
const radarData = [
  { metric: 'Revenue', storeValue: 85, regionAvg: 72, nationalAvg: 68 },
  { metric: 'Transactions', storeValue: 78, regionAvg: 75, nationalAvg: 70 },
  { metric: 'Avg Basket', storeValue: 82, regionAvg: 80, nationalAvg: 78 },
  { metric: 'Inventory', storeValue: 90, regionAvg: 85, nationalAvg: 82 },
  { metric: 'Customer Satisfaction', storeValue: 88, regionAvg: 82, nationalAvg: 80 },
  { metric: 'Staff Efficiency', storeValue: 75, regionAvg: 78, nationalAvg: 76 },
];

// Hourly traffic pattern
const hourlyTraffic = [
  { hour: '6AM', customers: 12, sales: 4800 },
  { hour: '7AM', customers: 18, sales: 7200 },
  { hour: '8AM', customers: 28, sales: 11200 },
  { hour: '9AM', customers: 42, sales: 16800 },
  { hour: '10AM', customers: 55, sales: 22000 },
  { hour: '11AM', customers: 68, sales: 27200 },
  { hour: '12PM', customers: 89, sales: 35600 },
  { hour: '1PM', customers: 82, sales: 32800 },
  { hour: '2PM', customers: 75, sales: 30000 },
  { hour: '3PM', customers: 69, sales: 27600 },
  { hour: '4PM', customers: 78, sales: 31200 },
  { hour: '5PM', customers: 92, sales: 36800 },
  { hour: '6PM', customers: 105, sales: 42000 },
  { hour: '7PM', customers: 89, sales: 35600 },
  { hour: '8PM', customers: 62, sales: 24800 },
];

// Reorder alerts
const reorderAlerts = [
  { product: 'Alaska Evap Milk', currentStock: 45, reorderPoint: 50, daysLeft: 2, priority: 'high' },
  { product: 'Lucky Me Pancit Canton', currentStock: 156, reorderPoint: 200, daysLeft: 3, priority: 'medium' },
  { product: 'Coke 1.5L', currentStock: 89, reorderPoint: 100, daysLeft: 4, priority: 'medium' },
  { product: 'Milo 1kg', currentStock: 12, reorderPoint: 30, daysLeft: 1, priority: 'critical' },
];

// Store scorecard metrics
const scorecardMetrics = [
  { metric: 'Revenue Target', actual: 892000, target: 850000, achievement: 105 },
  { metric: 'Transaction Target', actual: 2304, target: 2200, achievement: 104.7 },
  { metric: 'Basket Size Target', actual: 387, target: 400, achievement: 96.8 },
  { metric: 'Inventory Health', actual: 85, target: 90, achievement: 94.4 },
];

const StoreAnalytics = () => {
  const [selectedStore, setSelectedStore] = useState('STR-045');
  const [timeRange, setTimeRange] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  const recommendations = [
    {
      id: 1,
      title: 'Critical Stock Alert',
      description: 'Milo 1kg has only 1 day of stock left. Immediate reorder required to avoid stockout.',
      priority: 'high' as const,
      metric: '1 day stock',
    },
    {
      id: 2,
      title: 'Peak Hour Optimization',
      description: 'Store experiences peak traffic at 6PM. Consider adding staff during 5-7PM window.',
      priority: 'medium' as const,
      metric: '105 customers/hour',
    },
    {
      id: 3,
      title: 'Inventory Turnover Opportunity',
      description: 'Household category has low turnover (3.5x). Review product mix and pricing strategy.',
      priority: 'medium' as const,
      metric: '3.5x turnover',
    },
    {
      id: 4,
      title: 'High Performer Recognition',
      description: 'Store ranks #2 regionally with 15.2% revenue growth. Share best practices with other stores.',
      priority: 'low' as const,
      metric: '#2 Regional Rank',
    },
  ];

  const getStockLevelColor = (level: number) => {
    if (level >= 80) return 'text-green-600';
    if (level >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Analytics</h1>
          <p className="text-gray-600 mt-1">Individual store performance and inventory management</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STR-045">Store #45 - Makati</SelectItem>
              <SelectItem value="STR-012">Store #12 - Quezon City</SelectItem>
              <SelectItem value="STR-078">Store #78 - Cebu</SelectItem>
              <SelectItem value="STR-023">Store #23 - Davao</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Generate Report</Button>
        </div>
      </div>

      {/* Store Info Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Store className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{storeData.name}</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                <div>Manager: {storeData.manager}</div>
                <div>Type: {storeData.type}</div>
                <div>Region: {storeData.region}</div>
                <div>Size: {storeData.size}</div>
              </div>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Active
          </Badge>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₱{(storeKPIs.revenue / 1000).toFixed(0)}K</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +{storeKPIs.revenueGrowth}%
              </p>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              #{storeKPIs.rankRegional}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{storeKPIs.transactions.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                ₱{storeKPIs.avgBasket} avg basket
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inventory Health</p>
              <p className="text-2xl font-bold text-gray-900">{storeKPIs.inventory}%</p>
              <p className="text-sm text-orange-600">
                {storeKPIs.stockouts} stockouts
              </p>
            </div>
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Rating</p>
              <p className="text-2xl font-bold text-gray-900">{storeKPIs.customerSatisfaction}/5</p>
              <p className="text-sm text-gray-500">
                Based on 234 reviews
              </p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue & Transaction Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Revenue (₱)"
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

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Store Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="This Store" 
                    dataKey="storeValue" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6} 
                  />
                  <Radar 
                    name="Region Avg" 
                    dataKey="regionAvg" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.3} 
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Hourly Traffic & Sales Pattern</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hourlyTraffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="customers" fill="#3b82f6" name="Customers" />
                <Bar yAxisId="right" dataKey="sales" fill="#10b981" name="Sales (₱)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Inventory by Category</h3>
              <div className="space-y-4">
                {inventoryMetrics.map((category, index) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <p className="text-sm text-gray-600">
                          {category.skus} SKUs • ₱{(category.stockValue / 1000).toFixed(0)}K value
                        </p>
                      </div>
                      <Badge className={getPriorityBadge(category.stockoutRisk.toLowerCase())}>
                        {category.stockoutRisk} Risk
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>Turnover: {category.turnover}x</span>
                      <Progress value={category.turnover * 10} className="flex-1" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Reorder Alerts</h3>
              <div className="space-y-3">
                {reorderAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`h-5 w-5 ${
                        alert.priority === 'critical' ? 'text-red-600' : 
                        alert.priority === 'high' ? 'text-orange-600' : 'text-yellow-600'
                      }`} />
                      <div>
                        <p className="font-medium">{alert.product}</p>
                        <p className="text-sm text-gray-600">
                          Stock: {alert.currentStock} units • {alert.daysLeft} days left
                        </p>
                      </div>
                    </div>
                    <Badge className={getPriorityBadge(alert.priority)}>
                      {alert.priority}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">View All Alerts</Button>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Products by Sales</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium text-right">Sales</th>
                    <th className="pb-3 font-medium text-right">Units</th>
                    <th className="pb-3 font-medium text-right">Stock Level</th>
                    <th className="pb-3 font-medium text-center">Velocity</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformance.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3">{product.product}</td>
                      <td className="py-3 text-right">₱{product.sales.toLocaleString()}</td>
                      <td className="py-3 text-right">{product.units.toLocaleString()}</td>
                      <td className={`py-3 text-right font-medium ${getStockLevelColor(product.stockLevel)}`}>
                        {product.stockLevel}%
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className={
                          product.velocity === 'Very High' ? 'bg-red-50 text-red-700' :
                          product.velocity === 'High' ? 'bg-orange-50 text-orange-700' :
                          'bg-yellow-50 text-yellow-700'
                        }>
                          {product.velocity}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Regional Rank</h4>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-blue-600">#{storeKPIs.rankRegional}</p>
              <p className="text-sm text-gray-600 mt-1">out of 28 stores in NCR</p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">Previous month: #4</p>
                <p className="text-sm text-green-600">↑ Improved 2 positions</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">National Rank</h4>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-purple-600">#{storeKPIs.rankNational}</p>
              <p className="text-sm text-gray-600 mt-1">out of 138 stores nationwide</p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">Previous month: #18</p>
                <p className="text-sm text-green-600">↑ Improved 6 positions</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Performance Score</h4>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-3xl font-bold text-green-600">92/100</p>
              <p className="text-sm text-gray-600 mt-1">Excellent performance</p>
              <div className="mt-4 pt-4 border-t">
                <Progress value={92} className="mb-2" />
                <p className="text-sm text-gray-600">Target: 85/100</p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics Breakdown</h3>
            <div className="space-y-4">
              {scorecardMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{metric.metric}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-600">
                        Actual: {typeof metric.actual === 'number' && metric.actual > 10000 
                          ? `₱${(metric.actual / 1000).toFixed(0)}K` 
                          : metric.actual.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Target: {typeof metric.target === 'number' && metric.target > 10000 
                          ? `₱${(metric.target / 1000).toFixed(0)}K` 
                          : metric.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={metric.achievement} className="w-32" />
                    <span className={`font-semibold ${
                      metric.achievement >= 100 ? 'text-green-600' : 
                      metric.achievement >= 90 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {metric.achievement.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Scorecard Tab */}
        <TabsContent value="scorecard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Scorecard</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium">Revenue Target</p>
                      <p className="text-sm text-gray-600">₱892K / ₱850K</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">105%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium">Transaction Target</p>
                      <p className="text-sm text-gray-600">2,304 / 2,200</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold">104.7%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-medium">Basket Size Target</p>
                      <p className="text-sm text-gray-600">₱387 / ₱400</p>
                    </div>
                  </div>
                  <span className="text-orange-600 font-semibold">96.8%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-medium">Inventory Health</p>
                      <p className="text-sm text-gray-600">85% / 90%</p>
                    </div>
                  </div>
                  <span className="text-orange-600 font-semibold">94.4%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Key Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-full mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Revenue Growth Leader</p>
                    <p className="text-sm text-gray-600">15.2% growth rate, highest in region</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full mt-1">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Customer Satisfaction</p>
                    <p className="text-sm text-gray-600">4.5/5 rating from 234 reviews</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-full mt-1">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Top 10% Nationally</p>
                    <p className="text-sm text-gray-600">Ranked #12 out of 138 stores</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 rounded-full mt-1">
                    <Clock className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Operational Excellence</p>
                    <p className="text-sm text-gray-600">Zero critical stockouts this month</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Action Items & Recommendations</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Immediate Actions</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <p className="text-sm">Reorder Milo 1kg immediately - critical stock level</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <p className="text-sm">Review dairy category pricing to improve margins</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    <p className="text-sm">Schedule staff for 5-7PM peak hours</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Strategic Improvements</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-sm">Implement upselling training to increase basket size</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-sm">Optimize household category product mix</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                    <p className="text-sm">Share peak hour strategies with other stores</p>
                  </div>
                </div>
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

export default StoreAnalytics;