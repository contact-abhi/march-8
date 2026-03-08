# Smart Traffic Congestion Detection System - Setup Guide

## Features

✅ **Interactive Map** - Real-time traffic visualization using Leaflet with color-coded markers
✅ **Traffic Reporting** - Submit traffic incidents with location, congestion level, and description
✅ **Statistics Dashboard** - View congestion metrics, hotspots, and peak hour predictions
✅ **Real-time Updates** - Auto-refresh every 5 seconds to show latest traffic data
✅ **Congestion Prediction** - AI-powered predictions based on historical patterns
✅ **Alternative Routes** - Smart route suggestions when traffic is heavy
✅ **Dark/Light Mode** - Responsive theme toggle with automatic preference detection
✅ **Supabase Integration** - PostgreSQL backend for persistent data storage

## Quick Start

### 1. Install Dependencies
The project automatically installs dependencies. Just run:
```bash
npm run dev
# or
pnpm dev
```

### 2. Set Up Supabase (Optional but Recommended)
If you want persistent data storage:

1. Go to your Supabase project settings
2. Copy your **Project URL** and **Anon Key**
3. Add them to your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. The app will automatically create the database tables on first use

### 3. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Using the App

### Submitting Traffic Reports
1. Fill in the latitude/longitude (or use the default NYC coordinates)
2. Select traffic level: Low (Green), Medium (Yellow), or Heavy (Red)
3. Optionally add a description
4. Click "Submit Report"

### Viewing Traffic Data
- **Map**: Shows color-coded markers for each report
- **Statistics Panel**: Displays congestion rates, hotspots, and predictions
- **Live Updates**: Data refreshes automatically every 5 seconds

### Theme Toggle
Click the sun/moon icon in the header to switch between light and dark modes

## Architecture

```
app/
├── page.tsx              # Main page component
├── layout.tsx            # Root layout with metadata
├── globals.css           # Theme and styling
└── api/
    └── reports/
        └── route.ts      # API endpoints for traffic reports

components/
├── traffic-map.tsx       # Leaflet map visualization
├── report-form.tsx       # Form to submit new reports
├── statistics-panel.tsx  # Dashboard with analytics
├── theme-toggle.tsx      # Dark/light mode toggle
└── layout-provider.tsx   # Theme initialization provider
```

## API Endpoints

### GET /api/reports
Fetches all traffic reports

**Response:**
```json
[
  {
    "id": "uuid",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "traffic_level": "heavy",
    "description": "Major accident",
    "timestamp": "2024-03-08T12:00:00Z"
  }
]
```

### POST /api/reports
Submit a new traffic report

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "traffic_level": "heavy",
  "description": "Optional description"
}
```

## Features Explained

### Real-time Map
- Uses Leaflet for interactive mapping
- Circle markers with color coding:
  - 🟢 Green: Low traffic
  - 🟡 Yellow: Medium traffic
  - 🔴 Red: Heavy congestion
- Popup shows traffic level, time, and description

### Congestion Prediction
- Analyzes historical traffic patterns by hour
- Predicts peak traffic hours based on data
- Shows confidence level based on sample size

### Hotspot Detection
- Identifies clusters of heavy traffic
- Groups nearby reports within ~1km radius
- Shows top 3 congestion hotspots

### Alternative Routes
- Dynamically suggests routes when congestion detected
- Suggestions based on traffic severity
- Includes multiple transportation options

### Dark/Light Mode
- Automatic detection of system preferences
- Persistent storage in localStorage
- Smooth transitions between themes
- Full theme color customization via CSS variables

## Database Schema (Supabase)

### traffic_reports table
```sql
CREATE TABLE traffic_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  traffic_level VARCHAR(10) CHECK (traffic_level IN ('low', 'medium', 'heavy')),
  description TEXT,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

## Sample Data
The app comes with sample NYC traffic data if Supabase is not configured. It includes:
- Major accidents on Broadway
- Construction on 42nd Street
- Regular rush hour congestion
- Light traffic areas

## Deployment

### Deploy to Vercel
```bash
git push origin main
```

The app will automatically deploy to Vercel with:
- Automatic environment variable setup
- Edge function optimization
- Automatic dependency installation

### Environment Variables Needed
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase public anon key

## Technology Stack

- **Framework**: Next.js 16 with React 19.2
- **Styling**: Tailwind CSS v4
- **Map**: Leaflet
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **State Management**: React Hooks + SWR-like polling

## Performance Optimizations

- Client-side polling (5-second intervals) for real-time updates
- Dynamic Leaflet import for reduced initial bundle size
- Marker clustering for efficient rendering
- CSS variables for theme switching without re-renders
- Responsive design with mobile-first approach

## Troubleshooting

**Map not loading?**
- Check browser console for errors
- Ensure Leaflet CSS is imported
- Verify container ID matches

**No data showing?**
- Check if Supabase is configured (optional)
- If not configured, app uses sample data
- Try submitting a new report

**Dark mode not working?**
- Clear localStorage
- Check browser supports localStorage
- Verify CSS class 'dark' is applied to html element

## Future Enhancements

- WebSocket support for real-time updates
- ML-based prediction model
- Traffic camera integration
- Public transit integration
- Community reporting moderation
- Traffic incident categorization
- Heatmap visualization
- Export reports to CSV/PDF
