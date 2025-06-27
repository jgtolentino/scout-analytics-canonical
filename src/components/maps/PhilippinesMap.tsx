import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { philippinesRegions, storeLocations, regionalSalesData } from '@/data/philippinesRegions';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PhilippinesMapProps {
  metric?: 'sales' | 'stores' | 'transactions' | 'growth';
  showStores?: boolean;
  onRegionClick?: (regionCode: string) => void;
}

export const PhilippinesMap: React.FC<PhilippinesMapProps> = ({ 
  metric = 'sales',
  showStores = false,
  onRegionClick 
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [mapMetric, setMapMetric] = useState(metric);
  const mapRef = useRef<L.Map | null>(null);

  // Get color scale based on metric
  const getColorScale = () => {
    const values = Object.values(regionalSalesData).map(d => d[mapMetric]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    return scaleSequential(interpolateBlues).domain([min, max]);
  };

  const colorScale = getColorScale();

  // Style function for GeoJSON
  const style = (feature: any) => {
    const regionData = regionalSalesData[feature.properties.region_code];
    const value = regionData ? regionData[mapMetric] : 0;
    
    return {
      fillColor: colorScale(value),
      weight: selectedRegion === feature.properties.region_code ? 3 : 1,
      opacity: 1,
      color: selectedRegion === feature.properties.region_code ? '#333' : 'white',
      dashArray: '0',
      fillOpacity: 0.7
    };
  };

  // Interaction handlers
  const onEachFeature = (feature: any, layer: any) => {
    const regionData = regionalSalesData[feature.properties.region_code];
    
    // Popup content
    const popupContent = `
      <div style="font-family: system-ui; padding: 8px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
          ${feature.properties.region_name}
        </h3>
        <div style="font-size: 14px; line-height: 1.5;">
          <div><strong>Sales:</strong> ₱${(regionData.sales / 1000000).toFixed(1)}M</div>
          <div><strong>Stores:</strong> ${regionData.stores}</div>
          <div><strong>Transactions:</strong> ${regionData.transactions.toLocaleString()}</div>
          <div><strong>Growth:</strong> ${regionData.growth}%</div>
        </div>
      </div>
    `;

    layer.bindPopup(popupContent);

    // Hover effects
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
        layer.bringToFront();
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(style(feature));
      },
      click: (e: any) => {
        setSelectedRegion(feature.properties.region_code);
        if (onRegionClick) {
          onRegionClick(feature.properties.region_code);
        }
      }
    });
  };

  // Create custom store markers
  const createCustomIcon = (sales: number) => {
    const size = sales > 150000 ? 'large' : sales > 100000 ? 'medium' : 'small';
    const sizeMap = { large: 12, medium: 10, small: 8 };
    
    return L.divIcon({
      className: 'custom-store-marker',
      html: `<div style="
        background-color: #3b82f6;
        border: 2px solid white;
        border-radius: 50%;
        width: ${sizeMap[size]}px;
        height: ${sizeMap[size]}px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [sizeMap[size], sizeMap[size]],
      iconAnchor: [sizeMap[size] / 2, sizeMap[size] / 2]
    });
  };

  // Legend component
  const Legend = () => {
    const values = Object.values(regionalSalesData).map(d => d[mapMetric]);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const steps = 5;
    
    const formatValue = (value: number) => {
      switch (mapMetric) {
        case 'sales':
          return `₱${(value / 1000000).toFixed(1)}M`;
        case 'stores':
          return value.toString();
        case 'transactions':
          return value.toLocaleString();
        case 'growth':
          return `${value.toFixed(1)}%`;
        default:
          return value.toString();
      }
    };

    return (
      <div className="absolute bottom-8 left-8 bg-white p-4 rounded shadow-lg z-[1000]">
        <h4 className="text-sm font-semibold mb-2 capitalize">{mapMetric}</h4>
        <div className="space-y-1">
          {Array.from({ length: steps }, (_, i) => {
            const value = min + (max - min) * (i / (steps - 1));
            return (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-6 h-4 border border-gray-300"
                  style={{ backgroundColor: colorScale(value) }}
                />
                <span className="text-xs">{formatValue(value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Regional Performance Map</h3>
        <div className="flex gap-2">
          <Select value={mapMetric} onValueChange={(value: any) => setMapMetric(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">Sales (₱)</SelectItem>
              <SelectItem value="stores">Store Count</SelectItem>
              <SelectItem value="transactions">Transactions</SelectItem>
              <SelectItem value="growth">Growth (%)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="relative" style={{ height: '500px' }}>
        <MapContainer
          center={[12.8797, 121.7740]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
          ref={(map) => { if (map) mapRef.current = map; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <GeoJSON
            data={philippinesRegions as any}
            style={style}
            onEachFeature={onEachFeature}
          />
          
          {showStores && storeLocations.map((store) => (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createCustomIcon(store.sales)}
            >
              <Popup>
                <div>
                  <h4 className="font-semibold">{store.name}</h4>
                  <p>Sales: ₱{store.sales.toLocaleString()}</p>
                  <p>Region: {store.region}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        <Legend />
      </div>
      
      {selectedRegion && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">
            Selected: {philippinesRegions.features.find(f => f.properties.region_code === selectedRegion)?.properties.region_name}
          </h4>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Sales:</span>
              <p className="font-semibold">₱{(regionalSalesData[selectedRegion].sales / 1000000).toFixed(1)}M</p>
            </div>
            <div>
              <span className="text-gray-600">Stores:</span>
              <p className="font-semibold">{regionalSalesData[selectedRegion].stores}</p>
            </div>
            <div>
              <span className="text-gray-600">Transactions:</span>
              <p className="font-semibold">{regionalSalesData[selectedRegion].transactions.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600">Growth:</span>
              <p className="font-semibold text-green-600">+{regionalSalesData[selectedRegion].growth}%</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};