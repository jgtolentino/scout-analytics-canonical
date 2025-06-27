# Philippines Multi-Level Choropleth Map Implementation Guide

## Overview

This guide explains the implementation of a multi-level choropleth map for the Philippines, supporting drill-down functionality from regions → provinces → cities/municipalities.

## Features Implemented

### 1. **Multi-Level Navigation**
- **Regions (17)**: Top-level administrative divisions
- **Provinces (81)**: Second-level divisions within regions
- **Cities/Municipalities (1,489)**: Finest granularity

### 2. **Interactive Drill-Down**
- Click any region to zoom in and see its provinces
- Click any province to see its cities/municipalities
- Breadcrumb navigation for easy level switching
- "Reset View" button to return to national view

### 3. **Data Visualization**
- Color-coded choropleth based on selected metric
- Dynamic color scaling per administrative level
- Support for multiple metrics:
  - Sales (₱)
  - Store Count
  - Transactions
  - Growth (%)

### 4. **Performance Optimization**
- Progressive data loading
- Simplified geometries for better performance
- Level-appropriate detail rendering

## File Structure

```
src/
├── components/
│   └── maps/
│       ├── PhilippinesMap.tsx          # Original single-level map
│       └── MultiLevelPhilippinesMap.tsx # New multi-level map
├── services/
│   └── geoDataService.ts               # Geographic data service
├── pages/
│   ├── GeographicAnalytics.tsx         # Original geographic page
│   └── GeographicDrilldown.tsx         # New drill-down page
└── data/
    └── philippinesRegions.ts           # Base regions data
```

## Implementation Details

### 1. **MultiLevelPhilippinesMap Component**

```typescript
// Key props
interface MultiLevelPhilippinesMapProps {
  metric?: 'sales' | 'stores' | 'transactions' | 'growth';
  onAreaSelect?: (areaCode: string, level: string) => void;
  salesData?: any;
}
```

Features:
- State management for current level and selection
- Dynamic GeoJSON loading based on level
- Interactive hover and click handlers
- Responsive legend with level-appropriate formatting

### 2. **GeoDataService**

Handles data aggregation and synthetic data generation:
- `getProvincesForRegion(regionCode)`: Returns provinces within a region
- `getMunicipalitiesForProvince(provinceCode)`: Returns cities/municipalities
- `searchLocations(query)`: Cross-level location search
- `getAggregatedData(level, parentCode)`: Fetches data for any level

### 3. **Geographic Drilldown Page**

Complete analytics dashboard featuring:
- Multi-level map with tabs for different views
- Performance analysis by administrative level
- Expansion opportunity identification
- Regional insights and comparisons

## Usage Instructions

### 1. **Basic Implementation**

```jsx
import { MultiLevelPhilippinesMap } from '@/components/maps/MultiLevelPhilippinesMap';

// In your component
<MultiLevelPhilippinesMap 
  metric="sales"
  onAreaSelect={(areaCode, level) => {
    console.log(`Selected ${areaCode} at ${level} level`);
  }}
/>
```

### 2. **With Custom Sales Data**

```jsx
const salesData = {
  'NCR': { sales: 9447000, stores: 45, transactions: 15000 },
  'NCR-MNL': { sales: 2100000, stores: 12, transactions: 3500 },
  // ... more data
};

<MultiLevelPhilippinesMap 
  metric="sales"
  salesData={salesData}
/>
```

### 3. **Navigation Patterns**

Users can navigate through:
1. **Click-based drill-down**: Click region → see provinces → click province → see cities
2. **Breadcrumb navigation**: Jump between levels using breadcrumb links
3. **Direct level selection**: Use badges to jump to any level
4. **Search functionality**: Find specific locations across all levels

## Data Requirements

### 1. **GeoJSON Structure**

Each level requires properly formatted GeoJSON:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "region_code": "NCR",
        "region_name": "National Capital Region",
        "sales": 9447000,
        "stores": 45,
        "transactions": 15000,
        "growth": 15.2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lng, lat], ...]]
      }
    }
  ]
}
```

### 2. **Hierarchical Data Mapping**

Ensure proper parent-child relationships:
- Regions contain provinces
- Provinces contain cities/municipalities
- Each level should have unique identifiers

## Customization Options

### 1. **Color Schemes**

Modify color scales in `MultiLevelPhilippinesMap.tsx`:

```typescript
const colorScales = {
  sales: interpolateBlues,      // Blue gradient
  stores: interpolateGreens,     // Green gradient
  transactions: interpolateOranges, // Orange gradient
  growth: interpolateBlues       // Blue gradient
};
```

### 2. **Performance Tuning**

For large datasets:
- Implement viewport-based loading
- Use simplified geometries at lower zoom levels
- Consider clustering for dense urban areas

### 3. **Adding New Metrics**

To add new metrics:
1. Update the metric type definition
2. Add color scale mapping
3. Update the legend formatter
4. Add data to your service layer

## Real Data Integration

### 1. **API Endpoints**

Replace synthetic data with real API calls:

```typescript
// In geoDataService.ts
const loadRealData = async (level: string, parentId?: string) => {
  const response = await fetch(`/api/geodata/${level}?parent=${parentId}`);
  return response.json();
};
```

### 2. **Database Schema**

Recommended structure:
```sql
-- Geographic hierarchy
CREATE TABLE geographic_units (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100),
  level ENUM('region', 'province', 'city'),
  parent_id VARCHAR(20),
  geometry GEOMETRY
);

-- Sales data
CREATE TABLE location_metrics (
  location_id VARCHAR(20),
  metric_date DATE,
  sales DECIMAL(12,2),
  transactions INT,
  stores INT,
  growth_rate DECIMAL(5,2)
);
```

## Best Practices

1. **Performance**
   - Load data progressively
   - Implement caching for frequently accessed levels
   - Use Web Workers for heavy computations

2. **User Experience**
   - Provide loading indicators
   - Show tooltips on hover
   - Maintain zoom/pan context between levels

3. **Data Accuracy**
   - Validate geographic boundaries
   - Ensure data aggregation is accurate
   - Handle missing data gracefully

## Troubleshooting

### Common Issues:

1. **Map not rendering**: Check GeoJSON validity and coordinate system
2. **Performance issues**: Simplify geometries, implement viewport culling
3. **Data mismatch**: Verify parent-child relationships in hierarchy

## Future Enhancements

1. **Real Philippine GeoJSON**: Integration with official PSGC boundaries
2. **Time-based animations**: Show growth over time
3. **3D visualization**: Extrude polygons based on metrics
4. **Mobile optimization**: Touch-friendly interactions
5. **Export functionality**: Download maps as images or PDFs

---

For questions or improvements, please refer to the main project documentation.