import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');

    // Create traffic_reports table
    const { error: createTableError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS traffic_reports (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          latitude DECIMAL(10, 8) NOT NULL,
          longitude DECIMAL(11, 8) NOT NULL,
          traffic_level VARCHAR(10) NOT NULL CHECK (traffic_level IN ('low', 'medium', 'heavy')),
          description TEXT,
          timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS traffic_statistics (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          date DATE NOT NULL,
          hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
          avg_congestion_level DECIMAL(3, 2),
          total_reports INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(date, hour)
        );
        
        CREATE INDEX IF NOT EXISTS idx_traffic_reports_timestamp ON traffic_reports(timestamp DESC);
        CREATE INDEX IF NOT EXISTS idx_traffic_reports_location ON traffic_reports(latitude, longitude);
        CREATE INDEX IF NOT EXISTS idx_traffic_reports_level ON traffic_reports(traffic_level);
        CREATE INDEX IF NOT EXISTS idx_traffic_statistics_date_hour ON traffic_statistics(date, hour);
        
        ALTER TABLE traffic_reports ENABLE ROW LEVEL SECURITY;
        ALTER TABLE traffic_statistics ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow public read" ON traffic_reports;
        DROP POLICY IF EXISTS "Allow public insert" ON traffic_reports;
        DROP POLICY IF EXISTS "Allow public delete" ON traffic_reports;
        DROP POLICY IF EXISTS "Allow public read stats" ON traffic_statistics;
        
        CREATE POLICY "Allow public read" ON traffic_reports FOR SELECT USING (true);
        CREATE POLICY "Allow public insert" ON traffic_reports FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow public delete" ON traffic_reports FOR DELETE USING (true);
        CREATE POLICY "Allow public read stats" ON traffic_statistics FOR SELECT USING (true);
      `
    });

    if (createTableError) {
      console.error('Error creating tables:', createTableError);
      process.exit(1);
    }

    console.log('✓ Database tables created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
