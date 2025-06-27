import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues, interpolateOranges, interpolateGreens } from 'd3-scale-chromatic';
import { Home, ChevronRight, Loader2, MapPin, TrendingUp, Store, Package } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// GeoJSON URLs for different administrative levels
const geoJsonUrls = {
  regions: '/api/geodata/regions',
  provinces: '/api/geodata/provinces',
  municipalities: '/api/geodata/municipalities',
  // Fallback to static files if API not available
  static: {
    regions: '/data/philippines_regions.geojson',
    provinces: '/data/philippines_provinces.geojson',
    municipalities: '/data/philippines_municipalities.geojson'
  }
};

// Map bounds control component
const MapBoundsHandler = ({ bounds }: { bounds: L.LatLngBoundsExpression | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [bounds, map]);
  
  return null;
};

interface MultiLevelPhilippinesMapProps {
  metric?: 'sales' | 'stores' | 'transactions' | 'growth';
  onAreaSelect?: (areaCode: string, level: string) => void;
  salesData?: any;
}

type AdminLevel = 'regions' | 'provinces' | 'municipalities';

interface AreaSelection {
  region?: string;
  regionName?: string;
  province?: string;
  provinceName?: string;
  municipality?: string;
  municipalityName?: string;
}

export const MultiLevelPhilippinesMap: React.FC<MultiLevelPhilippinesMapProps> = ({ 
  metric = 'sales',
  onAreaSelect,
  salesData = {}
}) => {
  const [currentLevel, setCurrentLevel] = useState<AdminLevel>('regions');
  const [selectedMetric, setSelectedMetric] = useState(metric);
  const [selectedArea, setSelectedArea] = useState<AreaSelection>({});
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mapBounds, setMapBounds] = useState<L.LatLngBoundsExpression | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Color scales for different metrics
  const colorScales = {
    sales: interpolateBlues,
    stores: interpolateGreens,
    transactions: interpolateOranges,
    growth: interpolateBlues
  };

  // Load GeoJSON data based on current level and selection
  useEffect(() => {
    loadGeoData();
  }, [currentLevel, selectedArea]);

  const loadGeoData = async () => {
    setLoading(true);
    try {
      // In a real implementation, fetch from API
      // For now, using the existing regions data
      if (currentLevel === 'regions') {
        const response = await fetch('/api/geodata/regions').catch(() => 
          // Fallback to existing data
          import('@/data/philippinesRegions').then(module => ({
            ok: true,
            json: async () => module.philippinesRegions
          }))
        );
        
        if (response.ok) {
          const data = await response.json();
          setGeoData(data);
        }
      } else {
        // For demo purposes, generate synthetic province/municipality data
        const syntheticData = generateSyntheticData(currentLevel, selectedArea);
        setGeoData(syntheticData);
      }
    } catch (error) {
      console.error('Error loading GeoJSON:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate synthetic data for provinces and municipalities (for demo)
  const generateSyntheticData = (level: AdminLevel, selection: AreaSelection) => {
    if (level === 'provinces' && selection.region) {
      // Generate provinces for selected region
      return {
        type: "FeatureCollection",
        features: generateProvinces(selection.region)
      };
    } else if (level === 'municipalities' && selection.province) {
      // Generate municipalities for selected province
      return {
        type: "FeatureCollection",
        features: generateMunicipalities(selection.province)
      };
    }
    return null;
  };

  // Helper to generate synthetic provinces
  const generateProvinces = (regionCode: string) => {
    const provincesByRegion: Record<string, string[]> = {
      'NCR': ['Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig'],
      'III': ['Bulacan', 'Pampanga', 'Bataan', 'Nueva Ecija', 'Tarlac', 'Zambales'],
      'IV-A': ['Cavite', 'Laguna', 'Batangas', 'Rizal', 'Quezon'],
      // Add more regions as needed
    };

    const provinces = provincesByRegion[regionCode] || ['Province 1', 'Province 2'];
    
    return provinces.map((name, index) => ({
      type: "Feature",
      properties: {
        province_code: `${regionCode}-P${index + 1}`,
        province_name: name,
        region: regionCode,
        sales: Math.random() * 5000000 + 500000,
        stores: Math.floor(Math.random() * 20) + 5,
        transactions: Math.floor(Math.random() * 5000) + 1000,
        growth: Math.random() * 20 - 5
      },
      geometry: {
        type: "Polygon",
        coordinates: [generatePolygonCoordinates(index)]
      }
    }));
  };

  // Helper to generate synthetic municipalities
  const generateMunicipalities = (provinceCode: string) => {
    const municipalitiesByProvince: Record<string, string[]> = {
      'Manila': ['Binondo', 'Ermita', 'Malate', 'Paco', 'Pandacan', 'Port Area', 'Quiapo', 'Sampaloc'],
      'Cavite': ['Bacoor', 'Dasmariñas', 'Imus', 'Tagaytay', 'Trece Martires', 'General Trias'],
      // Add more provinces as needed
    };

    const provinceName = provinceCode.split('-').pop() || 'Province';
    const municipalities = municipalitiesByProvince[provinceName] || 
      Array.from({ length: 8 }, (_, i) => `Municipality ${i + 1}`);
    
    return municipalities.map((name, index) => ({
      type: "Feature",
      properties: {
        municipality_code: `${provinceCode}-M${index + 1}`,
        municipality_name: name,
        province: provinceCode,
        sales: Math.random() * 1000000 + 100000,
        stores: Math.floor(Math.random() * 5) + 1,
        transactions: Math.floor(Math.random() * 1000) + 200,
        growth: Math.random() * 30 - 10
      },
      geometry: {
        type: "Polygon",
        coordinates: [generatePolygonCoordinates(index, 0.1)]
      }
    }));
  };

  // Generate dummy polygon coordinates (for demo)
  const generatePolygonCoordinates = (index: number, size: number = 0.5) => {
    const baseCoords = { lat: 14.5 + index * 0.3, lng: 121.0 + index * 0.2 };
    return [
      [baseCoords.lng, baseCoords.lat],
      [baseCoords.lng + size, baseCoords.lat],
      [baseCoords.lng + size, baseCoords.lat + size],
      [baseCoords.lng, baseCoords.lat + size],
      [baseCoords.lng, baseCoords.lat]
    ];
  };

  // Get sales data for a specific area
  const getSalesForArea = (areaCode: string): number => {
    return salesData[areaCode]?.sales || Math.random() * 5000000;
  };

  // Get color scale based on current level
  const getColorScale = () => {
    const values = geoData?.features?.map((f: any) => {
      const key = currentLevel === 'regions' ? 'region_code' :
                  currentLevel === 'provinces' ? 'province_code' : 'municipality_code';
      return f.properties[selectedMetric] || 0;
    }) || [0];
    
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    return scaleSequential(colorScales[selectedMetric]).domain([min, max]);
  };

  const colorScale = getColorScale();

  // Style function for GeoJSON features
  const getFeatureStyle = (feature: any) => {
    const key = currentLevel === 'regions' ? 'region_code' :
                currentLevel === 'provinces' ? 'province_code' : 'municipality_code';
    const value = feature.properties[selectedMetric] || 0;
    const isHovered = hoveredFeature === feature.properties[key];
    
    return {
      fillColor: colorScale(value),
      weight: isHovered ? 3 : currentLevel === 'municipalities' ? 1 : 2,
      opacity: 1,
      color: isHovered ? '#333' : 'white',
      dashArray: '0',
      fillOpacity: isHovered ? 0.9 : 0.7,
      cursor: 'pointer'
    };
  };

  // Handle feature click for drill-down
  const handleFeatureClick = (feature: any, layer: any) => {
    if (currentLevel === 'regions') {
      setSelectedArea({
        region: feature.properties.region_code,
        regionName: feature.properties.region_name
      });
      setCurrentLevel('provinces');
      setMapBounds(layer.getBounds());
    } else if (currentLevel === 'provinces') {
      setSelectedArea(prev => ({
        ...prev,
        province: feature.properties.province_code,
        provinceName: feature.properties.province_name
      }));
      setCurrentLevel('municipalities');
      setMapBounds(layer.getBounds());
    } else {
      // Municipality level - show detailed view
      setSelectedArea(prev => ({
        ...prev,
        municipality: feature.properties.municipality_code,
        municipalityName: feature.properties.municipality_name
      }));
      if (onAreaSelect) {
        onAreaSelect(feature.properties.municipality_code, 'municipality');
      }
    }
  };

  // Handle breadcrumb navigation
  const navigateToLevel = (level: AdminLevel) => {
    setCurrentLevel(level);
    if (level === 'regions') {
      setSelectedArea({});
      setMapBounds(null);
    } else if (level === 'provinces') {
      setSelectedArea(prev => ({
        region: prev.region,
        regionName: prev.regionName
      }));
    }
  };

  // Create popup content
  const createPopupContent = (feature: any) => {
    const props = feature.properties;
    const name = props.region_name || props.province_name || props.municipality_name;
    
    return `
      <div style="font-family: system-ui; padding: 8px; min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
          ${name}
        </h3>
        <div style="font-size: 14px; line-height: 1.6;">
          <div><strong>Sales:</strong> ₱${((props.sales || 0) / 1000000).toFixed(2)}M</div>
          <div><strong>Stores:</strong> ${props.stores || 0}</div>
          <div><strong>Transactions:</strong> ${(props.transactions || 0).toLocaleString()}</div>
          <div><strong>Growth:</strong> ${props.growth > 0 ? '+' : ''}${(props.growth || 0).toFixed(1)}%</div>
        </div>
        ${currentLevel !== 'municipalities' ? 
          '<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">Click to drill down</div>' : 
          ''
        }
      </div>
    `;
  };

  // Legend component
  const Legend = () => {
    if (!geoData) return null;
    
    const values = geoData.features.map((f: any) => f.properties[selectedMetric] || 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const steps = 5;
    
    const formatValue = (value: number) => {
      switch (selectedMetric) {
        case 'sales':
          return `₱${(value / 1000000).toFixed(1)}M`;
        case 'stores':
          return Math.round(value).toString();
        case 'transactions':
          return value.toLocaleString();
        case 'growth':
          return `${value.toFixed(1)}%`;
        default:
          return value.toString();
      }
    };

    return (
      <div className="absolute bottom-8 left-8 bg-white p-4 rounded-lg shadow-lg z-[1000]">
        <h4 className="text-sm font-semibold mb-2 capitalize">{selectedMetric}</h4>
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
      <div className="space-y-4">
        {/* Header and Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Multi-Level Geographic Analytics</h3>
            <p className="text-sm text-gray-600">Click on areas to drill down</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
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
            <Button variant="outline" size="sm" onClick={() => navigateToLevel('regions')}>
              Reset View
            </Button>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="#" 
                onClick={(e) => { e.preventDefault(); navigateToLevel('regions'); }}
                className="flex items-center gap-1"
              >
                <Home className="h-4 w-4" />
                Philippines
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {selectedArea.regionName && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); navigateToLevel('provinces'); }}
                  >
                    {selectedArea.regionName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            
            {selectedArea.provinceName && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); navigateToLevel('municipalities'); }}
                  >
                    {selectedArea.provinceName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            
            {selectedArea.municipalityName && (
              <>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <span className="font-medium">{selectedArea.municipalityName}</span>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Level Indicators */}
        <div className="flex gap-2">
          <Badge 
            variant={currentLevel === 'regions' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => navigateToLevel('regions')}
          >
            17 Regions
          </Badge>
          <Badge 
            variant={currentLevel === 'provinces' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => currentLevel !== 'regions' && navigateToLevel('provinces')}
          >
            81 Provinces
          </Badge>
          <Badge 
            variant={currentLevel === 'municipalities' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => currentLevel === 'municipalities' && navigateToLevel('municipalities')}
          >
            1,489 Cities/Municipalities
          </Badge>
        </div>

        {/* Map Container */}
        <div className="relative" style={{ height: '600px' }}>
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-[1001]">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading map data...</span>
              </div>
            </div>
          )}
          
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
            
            <MapBoundsHandler bounds={mapBounds} />
            
            {geoData && (
              <GeoJSON
                key={`${currentLevel}-${JSON.stringify(selectedArea)}`}
                data={geoData}
                style={getFeatureStyle}
                onEachFeature={(feature, layer) => {
                  // Set up interactions
                  layer.on({
                    click: () => handleFeatureClick(feature, layer),
                    mouseover: (e) => {
                      const key = currentLevel === 'regions' ? 'region_code' :
                                  currentLevel === 'provinces' ? 'province_code' : 'municipality_code';
                      setHoveredFeature(feature.properties[key]);
                      layer.openPopup();
                    },
                    mouseout: (e) => {
                      setHoveredFeature(null);
                      layer.closePopup();
                    }
                  });
                  
                  // Bind popup
                  layer.bindPopup(createPopupContent(feature));
                }}
              />
            )}
          </MapContainer>
          
          <Legend />
        </div>

        {/* Current Selection Info */}
        {(selectedArea.regionName || selectedArea.provinceName || selectedArea.municipalityName) && (
          <Card className="p-4 bg-blue-50">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold mb-2">Current Selection</h4>
                <div className="text-sm space-y-1">
                  {selectedArea.regionName && (
                    <div><span className="text-gray-600">Region:</span> <span className="font-medium">{selectedArea.regionName}</span></div>
                  )}
                  {selectedArea.provinceName && (
                    <div><span className="text-gray-600">Province:</span> <span className="font-medium">{selectedArea.provinceName}</span></div>
                  )}
                  {selectedArea.municipalityName && (
                    <div><span className="text-gray-600">City/Municipality:</span> <span className="font-medium">{selectedArea.municipalityName}</span></div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Level</p>
                <p className="font-semibold capitalize">{currentLevel}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Card>
  );
};