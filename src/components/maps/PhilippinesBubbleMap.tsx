import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { storeLocations } from '@/data/philippinesRegions';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { interpolateReds, interpolateBlues, interpolateGreens, interpolateOranges } from 'd3-scale-chromatic';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PhilippinesBubbleMapProps {
  metric?: 'sales' | 'transactions' | 'growth' | 'efficiency';
  showClusters?: boolean;
  onStoreClick?: (storeId: string) => void;
}

// Extended store data with more metrics
const enrichedStoreData = storeLocations.map(store => ({
  ...store,
  transactions: Math.floor(Math.random() * 1000) + 200,
  growth: Math.random() * 40 - 10, // -10% to +30% growth
  efficiency: Math.random() * 100, // 0-100 efficiency score
  category: ['Type A', 'Type B', 'Type C'][Math.floor(Math.random() * 3)],
}));

// Component to handle map zoom based on selected filter
const MapZoomHandler = ({ center, zoom }: { center: [number, number] | null, zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  
  return null;
};

export const PhilippinesBubbleMap: React.FC<PhilippinesBubbleMapProps> = ({
  metric = 'sales',
  showClusters = false,
  onStoreClick
}) => {
  const [selectedMetric, setSelectedMetric] = useState(metric);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [hoveredStore, setHoveredStore] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [mapZoom, setMapZoom] = useState(6);

  // Region centers for zoom functionality
  const regionCenters: Record<string, [number, number]> = {
    'NCR': [14.5995, 120.9842],
    'CAR': [17.3514, 121.1722],
    'Region I': [16.0833, 120.6199],
    'Region III': [15.4827, 120.7120],
    'CALABARZON': [14.1008, 121.0794],
    'Western Visayas': [10.7202, 122.5621],
    'Central Visayas': [10.3157, 123.8854],
    'Davao Region': [7.3042, 125.6787],
  };

  // Filter stores based on selection
  const filteredStores = enrichedStoreData.filter(store => {
    if (selectedRegion !== 'all' && store.region !== selectedRegion) return false;
    if (selectedType !== 'all' && store.category !== selectedType) return false;
    return true;
  });

  // Calculate scales
  const getRadiusScale = () => {
    const values = filteredStores.map(s => s[selectedMetric] || 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Use square root scale for area representation
    return scaleSqrt()
      .domain([min, max])
      .range([5, 30]); // Min and max radius in pixels
  };

  const getColorScale = () => {
    const values = filteredStores.map(s => s[selectedMetric] || 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    const interpolators = {
      sales: interpolateBlues,
      transactions: interpolateGreens,
      growth: interpolateReds,
      efficiency: interpolateOranges
    };
    
    return scaleLinear()
      .domain([min, max])
      .range([0, 1]);
  };

  const radiusScale = getRadiusScale();
  const colorScale = getColorScale();

  // Get color based on metric
  const getColor = (value: number) => {
    const interpolators = {
      sales: interpolateBlues,
      transactions: interpolateGreens,
      growth: interpolateReds,
      efficiency: interpolateOranges
    };
    
    const normalizedValue = colorScale(value);
    return interpolators[selectedMetric](normalizedValue);
  };

  // Format value for display
  const formatValue = (value: number) => {
    switch (selectedMetric) {
      case 'sales':
        return `₱${(value / 1000).toFixed(0)}K`;
      case 'transactions':
        return value.toLocaleString();
      case 'growth':
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
      case 'efficiency':
        return `${value.toFixed(0)}%`;
      default:
        return value.toString();
    }
  };

  // Handle region selection
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    if (region !== 'all' && regionCenters[region]) {
      setMapCenter(regionCenters[region]);
      setMapZoom(9);
    } else {
      setMapCenter([12.8797, 121.7740]);
      setMapZoom(6);
    }
  };

  // Legend component
  const Legend = () => {
    const values = filteredStores.map(s => s[selectedMetric] || 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const steps = 4;
    
    return (
      <div className="absolute bottom-8 left-8 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h4 className="text-sm font-semibold mb-3 capitalize">{selectedMetric}</h4>
        
        {/* Size legend */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-2">Bubble Size</p>
          <div className="flex items-center gap-2">
            {[min, (min + max) / 2, max].map((value, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="rounded-full bg-gray-300 opacity-50"
                  style={{
                    width: radiusScale(value) * 2,
                    height: radiusScale(value) * 2,
                  }}
                />
                <span className="text-xs mt-1">{formatValue(value)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Color legend */}
        <div>
          <p className="text-xs text-gray-600 mb-2">Color Intensity</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: steps }, (_, i) => {
              const value = min + (max - min) * (i / (steps - 1));
              return (
                <div
                  key={i}
                  className="w-8 h-4"
                  style={{ backgroundColor: getColor(value) }}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Store Performance Bubble Map</h3>
        <div className="flex gap-2">
          <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="transactions">Transactions</SelectItem>
              <SelectItem value="growth">Growth Rate</SelectItem>
              <SelectItem value="efficiency">Efficiency</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedRegion} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="NCR">NCR</SelectItem>
              <SelectItem value="CAR">CAR</SelectItem>
              <SelectItem value="Region I">Region I</SelectItem>
              <SelectItem value="Region III">Region III</SelectItem>
              <SelectItem value="CALABARZON">CALABARZON</SelectItem>
              <SelectItem value="Western Visayas">Western Visayas</SelectItem>
              <SelectItem value="Central Visayas">Central Visayas</SelectItem>
              <SelectItem value="Davao Region">Davao Region</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Store type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Type A">Type A</SelectItem>
              <SelectItem value="Type B">Type B</SelectItem>
              <SelectItem value="Type C">Type C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Total Stores</p>
          <p className="text-lg font-semibold">{filteredStores.length}</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-lg font-semibold">
            ₱{(filteredStores.reduce((sum, s) => sum + s.sales, 0) / 1000000).toFixed(1)}M
          </p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <p className="text-sm text-gray-600">Avg Growth</p>
          <p className="text-lg font-semibold">
            {(filteredStores.reduce((sum, s) => sum + s.growth, 0) / filteredStores.length).toFixed(1)}%
          </p>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded">
          <p className="text-sm text-gray-600">Avg Efficiency</p>
          <p className="text-lg font-semibold">
            {(filteredStores.reduce((sum, s) => sum + s.efficiency, 0) / filteredStores.length).toFixed(0)}%
          </p>
        </div>
      </div>
      
      <div className="relative" style={{ height: '500px' }}>
        <MapContainer
          center={mapCenter || [12.8797, 121.7740]}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapZoomHandler center={mapCenter} zoom={mapZoom} />
          
          {filteredStores.map((store) => {
            const value = store[selectedMetric] || 0;
            const radius = radiusScale(value);
            const isHovered = hoveredStore === store.id;
            
            return (
              <CircleMarker
                key={store.id}
                center={[store.lat, store.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: getColor(value),
                  fillOpacity: isHovered ? 0.9 : 0.7,
                  color: isHovered ? '#333' : 'white',
                  weight: isHovered ? 3 : 1,
                }}
                eventHandlers={{
                  mouseover: () => setHoveredStore(store.id),
                  mouseout: () => setHoveredStore(null),
                  click: () => onStoreClick && onStoreClick(store.id),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h4 className="font-semibold mb-2">{store.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Region:</span>
                        <span className="font-medium">{store.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <Badge variant="outline" className="scale-75">{store.category}</Badge>
                      </div>
                      <div className="border-t pt-1 mt-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sales:</span>
                          <span className="font-medium">₱{store.sales.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transactions:</span>
                          <span className="font-medium">{store.transactions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Growth:</span>
                          <span className={`font-medium ${store.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {store.growth > 0 ? '+' : ''}{store.growth.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Efficiency:</span>
                          <span className="font-medium">{store.efficiency.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
        
        <Legend />
        
        {/* Hover info box */}
        {hoveredStore && (
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
            {(() => {
              const store = filteredStores.find(s => s.id === hoveredStore);
              if (!store) return null;
              return (
                <>
                  <h4 className="font-semibold">{store.name}</h4>
                  <p className="text-sm text-gray-600">{selectedMetric}: {formatValue(store[selectedMetric])}</p>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </Card>
  );
};