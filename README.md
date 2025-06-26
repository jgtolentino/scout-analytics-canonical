# Scout Analytics Dashboard

Enterprise-grade retail analytics platform for FMCG insights across Philippine sari-sari stores.

## 🚀 Features

- **Real-time Analytics**: Track 52,101+ transactions across 138 stores
- **Regional Insights**: Interactive Philippines choropleth map
- **Product Intelligence**: Category mix analysis with treemap visualization
- **Consumer Behavior**: Segment analysis and purchase patterns
- **AI Assistant**: Natural language queries for instant insights

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MySQL 8.0+ database

## 🛠️ Installation

```bash
# Clone repository
git clone https://github.com/your-org/scout-analytics-canonical.git
cd scout-analytics-canonical

# Install dependencies
pnpm install

# Set up environment variables
cp .env.template .env.local
# Edit .env.local with your database credentials
```

## 🔧 Configuration

### Database Setup

```sql
-- Create database
CREATE DATABASE scout_analytics;

-- Import schema
mysql -u root -p scout_analytics < database/schema.sql

-- Import seed data (optional)
mysql -u root -p scout_analytics < database/seed.sql
```

### Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=scout_analytics

# API
VITE_API_URL=http://localhost:8000/api/v1

# Optional: AI Features
OPENAI_API_KEY=your_openai_key
```

## 🚀 Running the Application

### Development Mode
```bash
pnpm dev
# Open http://localhost:5173
```

### Production Build
```bash
pnpm build
pnpm preview
```

### Docker Deployment
```bash
docker-compose up -d
```

## 📊 Architecture

```
scout-analytics-canonical/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── stores/         # State management
│   └── utils/          # Helper functions
├── public/             # Static assets
├── database/           # SQL schemas and migrations
├── docs/              # Additional documentation
└── docker/            # Docker configuration
```

## 🎯 Key Metrics Tracked

- **Total Sales**: ₱20.2M across all channels
- **Transaction Volume**: 52,101 daily transactions
- **Store Coverage**: 138 active sari-sari stores
- **Regional Distribution**: 17 regions nationwide
- **Product Categories**: 8 major FMCG categories

## 🔒 Security

- JWT authentication for API access
- Role-based access control (RBAC)
- Encrypted database connections
- Input validation and sanitization

## 📱 Responsive Design

- Desktop: Full dashboard experience (1440px+)
- Tablet: Optimized layout (768px-1439px)
- Mobile: Touch-friendly interface (<768px)

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Generate coverage report
pnpm test:coverage
```

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Component Library](./docs/COMPONENTS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🤝 Support

For technical support or questions:
- Email: support@your-company.com
- Documentation: https://docs.scout-analytics.com
- Issues: https://github.com/your-org/scout-analytics/issues

## 📄 License

Copyright © 2025 Your Company. All rights reserved.

---

Built with ❤️ for Philippine retail analytics
