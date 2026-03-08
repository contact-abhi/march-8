-- Create traffic_reports table
CREATE TABLE IF NOT EXISTS traffic_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  traffic_level VARCHAR(10) NOT NULL CHECK (traffic_level IN ('low', 'medium', 'heavy')),
  description TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create traffic_statistics table for analytics
CREATE TABLE IF NOT EXISTS traffic_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  avg_congestion_level DECIMAL(3, 2),
  total_reports INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, hour)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_traffic_reports_timestamp ON traffic_reports(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_traffic_reports_location ON traffic_reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_traffic_reports_level ON traffic_reports(traffic_level);
CREATE INDEX IF NOT EXISTS idx_traffic_statistics_date_hour ON traffic_statistics(date, hour);

-- Enable Row Level Security (optional, for future authentication)
ALTER TABLE traffic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public read/write for MVP (remove in production)
CREATE POLICY "Allow public read" ON traffic_reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON traffic_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON traffic_reports FOR DELETE USING (true);

CREATE POLICY "Allow public read stats" ON traffic_statistics FOR SELECT USING (true);
