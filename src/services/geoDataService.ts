// Service for handling multi-level geographic data
import { philippinesRegions } from '@/data/philippinesRegions';

export interface GeoFeature {
  type: 'Feature';
  properties: {
    [key: string]: any;
    sales: number;
    stores: number;
    transactions: number;
    growth: number;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

export interface GeoFeatureCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

// Province data mapping
const provinceData: Record<string, any> = {
  'NCR': {
    provinces: [
      { code: 'NCR-MNL', name: 'Manila', sales: 2100000, stores: 12, transactions: 3500, growth: 8.2 },
      { code: 'NCR-QC', name: 'Quezon City', sales: 3200000, stores: 18, transactions: 5200, growth: 12.5 },
      { code: 'NCR-MKT', name: 'Makati', sales: 2800000, stores: 15, transactions: 4100, growth: 15.3 },
      { code: 'NCR-PSG', name: 'Pasig', sales: 1800000, stores: 9, transactions: 2900, growth: 6.7 },
      { code: 'NCR-TGG', name: 'Taguig', sales: 2200000, stores: 11, transactions: 3600, growth: 18.9 },
    ]
  },
  'III': {
    provinces: [
      { code: 'III-BUL', name: 'Bulacan', sales: 1500000, stores: 8, transactions: 2400, growth: 9.1 },
      { code: 'III-PAM', name: 'Pampanga', sales: 1800000, stores: 10, transactions: 2900, growth: 11.3 },
      { code: 'III-BAT', name: 'Bataan', sales: 900000, stores: 5, transactions: 1500, growth: 4.2 },
      { code: 'III-NUE', name: 'Nueva Ecija', sales: 1200000, stores: 7, transactions: 2000, growth: 7.8 },
      { code: 'III-TAR', name: 'Tarlac', sales: 1100000, stores: 6, transactions: 1800, growth: 5.6 },
      { code: 'III-ZAM', name: 'Zambales', sales: 800000, stores: 4, transactions: 1300, growth: 3.9 },
    ]
  },
  'IV-A': {
    provinces: [
      { code: 'IVA-CAV', name: 'Cavite', sales: 2500000, stores: 14, transactions: 4100, growth: 14.2 },
      { code: 'IVA-LAG', name: 'Laguna', sales: 2300000, stores: 13, transactions: 3800, growth: 12.8 },
      { code: 'IVA-BAT', name: 'Batangas', sales: 1900000, stores: 11, transactions: 3100, growth: 8.9 },
      { code: 'IVA-RIZ', name: 'Rizal', sales: 2100000, stores: 12, transactions: 3400, growth: 10.5 },
      { code: 'IVA-QUE', name: 'Quezon', sales: 1000000, stores: 6, transactions: 1600, growth: 5.3 },
    ]
  },
};

// Municipality data mapping
const municipalityData: Record<string, any> = {
  'NCR-MNL': {
    municipalities: [
      { code: 'MNL-BIN', name: 'Binondo', sales: 350000, stores: 3, transactions: 580, growth: 6.2 },
      { code: 'MNL-ERM', name: 'Ermita', sales: 280000, stores: 2, transactions: 460, growth: 4.8 },
      { code: 'MNL-MAL', name: 'Malate', sales: 310000, stores: 2, transactions: 510, growth: 7.1 },
      { code: 'MNL-PAC', name: 'Paco', sales: 240000, stores: 2, transactions: 390, growth: 3.5 },
      { code: 'MNL-PAN', name: 'Pandacan', sales: 220000, stores: 1, transactions: 360, growth: 2.9 },
      { code: 'MNL-QUI', name: 'Quiapo', sales: 380000, stores: 3, transactions: 620, growth: 8.7 },
      { code: 'MNL-SAM', name: 'Sampaloc', sales: 320000, stores: 2, transactions: 520, growth: 5.4 },
    ]
  },
  'IVA-CAV': {
    municipalities: [
      { code: 'CAV-BAC', name: 'Bacoor', sales: 450000, stores: 3, transactions: 740, growth: 12.3 },
      { code: 'CAV-DAS', name: 'Dasmariñas', sales: 520000, stores: 4, transactions: 850, growth: 15.7 },
      { code: 'CAV-IMU', name: 'Imus', sales: 480000, stores: 3, transactions: 790, growth: 13.9 },
      { code: 'CAV-TAG', name: 'Tagaytay', sales: 350000, stores: 2, transactions: 570, growth: 9.8 },
      { code: 'CAV-TRE', name: 'Trece Martires', sales: 280000, stores: 2, transactions: 460, growth: 7.2 },
      { code: 'CAV-GEN', name: 'General Trias', sales: 420000, stores: 3, transactions: 690, growth: 11.5 },
    ]
  },
};

// Get provinces for a region
export const getProvincesForRegion = (regionCode: string): GeoFeatureCollection => {
  const provinces = provinceData[regionCode]?.provinces || [];
  
  // Find the region bounds from the original data
  const regionFeature = philippinesRegions.features.find(
    f => f.properties.region_code === regionCode
  );
  
  if (!regionFeature) {
    return { type: 'FeatureCollection', features: [] };
  }
  
  // Get region bounds
  const regionCoords = regionFeature.geometry.coordinates[0];
  const lngs = regionCoords.map((c: number[]) => c[0]);
  const lats = regionCoords.map((c: number[]) => c[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  
  // Divide region into provinces
  const features = provinces.map((province: any, index: number) => {
    const cols = Math.ceil(Math.sqrt(provinces.length));
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    const width = (maxLng - minLng) / cols;
    const height = (maxLat - minLat) / Math.ceil(provinces.length / cols);
    
    const provinceLng = minLng + col * width;
    const provinceLat = minLat + row * height;
    
    return {
      type: 'Feature',
      properties: {
        province_code: province.code,
        province_name: province.name,
        region: regionCode,
        sales: province.sales,
        stores: province.stores,
        transactions: province.transactions,
        growth: province.growth,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [provinceLng, provinceLat],
          [provinceLng + width * 0.9, provinceLat],
          [provinceLng + width * 0.9, provinceLat + height * 0.9],
          [provinceLng, provinceLat + height * 0.9],
          [provinceLng, provinceLat]
        ]]
      }
    };
  });
  
  return {
    type: 'FeatureCollection',
    features
  };
};

// Get municipalities for a province
export const getMunicipalitiesForProvince = (provinceCode: string): GeoFeatureCollection => {
  const municipalities = municipalityData[provinceCode]?.municipalities || [];
  
  // Generate grid layout for municipalities
  const features = municipalities.map((municipality: any, index: number) => {
    const cols = Math.ceil(Math.sqrt(municipalities.length));
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    // Create smaller polygons for municipalities
    const baseLng = 121.0 + (col * 0.05);
    const baseLat = 14.5 + (row * 0.05);
    
    return {
      type: 'Feature',
      properties: {
        municipality_code: municipality.code,
        municipality_name: municipality.name,
        province: provinceCode,
        sales: municipality.sales,
        stores: municipality.stores,
        transactions: municipality.transactions,
        growth: municipality.growth,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [baseLng, baseLat],
          [baseLng + 0.04, baseLat],
          [baseLng + 0.04, baseLat + 0.04],
          [baseLng, baseLat + 0.04],
          [baseLng, baseLat]
        ]]
      }
    };
  });
  
  return {
    type: 'FeatureCollection',
    features
  };
};

// Get aggregated data for a specific level
export const getAggregatedData = (level: 'regions' | 'provinces' | 'municipalities', parentCode?: string) => {
  switch (level) {
    case 'regions':
      // Return existing regions data with proper structure
      return philippinesRegions;
      
    case 'provinces':
      if (!parentCode) return { type: 'FeatureCollection', features: [] };
      return getProvincesForRegion(parentCode);
      
    case 'municipalities':
      if (!parentCode) return { type: 'FeatureCollection', features: [] };
      return getMunicipalitiesForProvince(parentCode);
      
    default:
      return { type: 'FeatureCollection', features: [] };
  }
};

// Search for locations across all levels
export const searchLocations = (query: string) => {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  // Search regions
  for (const feature of philippinesRegions.features) {
    if (feature.properties.region_name.toLowerCase().includes(lowerQuery)) {
      results.push({
        type: 'region',
        code: feature.properties.region_code,
        name: feature.properties.region_name,
        level: 'regions'
      });
    }
  }
  
  // Search provinces
  for (const regionCode in provinceData) {
    for (const province of provinceData[regionCode].provinces) {
      if (province.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'province',
          code: province.code,
          name: province.name,
          parent: regionCode,
          level: 'provinces'
        });
      }
    }
  }
  
  // Search municipalities
  for (const provinceCode in municipalityData) {
    for (const municipality of municipalityData[provinceCode].municipalities) {
      if (municipality.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'municipality',
          code: municipality.code,
          name: municipality.name,
          parent: provinceCode,
          level: 'municipalities'
        });
      }
    }
  }
  
  return results;
};