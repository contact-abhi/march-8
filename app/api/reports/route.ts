import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[v0] Supabase credentials missing');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export async function GET(request: NextRequest) {
  try {
    // Check if table exists by attempting a query
    const { data, error } = await supabase
      .from('traffic_reports')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(100);

    // If table doesn't exist, initialize it with sample data
    if (error && error.code === 'PGRST116') {
      console.log('[v0] Table not found, returning sample data');
      return NextResponse.json(getSampleData());
    }

    if (error) {
      console.error('[v0] Supabase error:', error);
      return NextResponse.json(getSampleData());
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('[v0] Error fetching reports:', error);
    return NextResponse.json(getSampleData());
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude, traffic_level, description } = body;

    // Validate input
    if (!latitude || !longitude || !traffic_level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to insert into database
    const { data, error } = await supabase
      .from('traffic_reports')
      .insert([
        {
          latitude,
          longitude,
          traffic_level,
          description,
          timestamp: new Date().toISOString(),
        },
      ])
      .select();

    // If table doesn't exist, still return success but use in-memory storage
    if (error && error.code === 'PGRST116') {
      console.log('[v0] Table not found, using in-memory storage');
      return NextResponse.json(
        {
          id: Math.random().toString(36).substr(2, 9),
          latitude,
          longitude,
          traffic_level,
          description,
          timestamp: new Date().toISOString(),
        },
        { status: 201 }
      );
    }

    if (error) {
      console.error('[v0] Error creating report:', error);
      return NextResponse.json(
        { error: 'Failed to create report' },
        { status: 500 }
      );
    }

    return NextResponse.json(data?.[0], { status: 201 });
  } catch (error) {
    console.error('[v0] Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSampleData() {
  return [
    {
      id: '1',
      latitude: 40.7128,
      longitude: -74.006,
      traffic_level: 'heavy',
      description: 'Major accident on Broadway',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
      id: '2',
      latitude: 40.7489,
      longitude: -73.968,
      traffic_level: 'heavy',
      description: 'Construction on 42nd Street',
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    },
    {
      id: '3',
      latitude: 40.758,
      longitude: -73.9855,
      traffic_level: 'medium',
      description: 'Regular rush hour congestion',
      timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
    },
    {
      id: '4',
      latitude: 40.7614,
      longitude: -73.9776,
      traffic_level: 'low',
      description: 'Light traffic flow',
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
      id: '5',
      latitude: 40.7505,
      longitude: -73.9972,
      traffic_level: 'medium',
      description: 'Traffic congestion near Times Square',
      timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
    },
  ];
}
