'use client';

import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { TrafficMap } from '@/components/traffic-map';
import { ReportForm } from '@/components/report-form';
import { StatisticsPanel } from '@/components/statistics-panel';
import { AlertCircle } from 'lucide-react';

export default function Home() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reports on mount and set up polling
  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchReports = async () => {
    try {
      setError(null);
      const response = await fetch('/api/reports');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.error('[v0] Error fetching reports:', err);
      setError('Failed to load traffic data');
      setLoading(false);
    }
  };

  const handleReportSubmitted = () => {
    fetchReports();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🚗</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Traffic Monitor</h1>
              <p className="text-sm text-muted-foreground">Real-time congestion detection</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
              <button 
                onClick={fetchReports}
                className="text-sm text-red-600 dark:text-red-400 hover:underline mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Map and Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Traffic Map */}
            <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
              <div className="aspect-video sm:aspect-auto sm:h-96">
                <TrafficMap reports={reports} isLoading={loading} />
              </div>
            </div>

            {/* Report Form */}
            <div className="bg-card rounded-xl border border-border shadow-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Report Traffic Incident</h2>
              <ReportForm onSubmitted={handleReportSubmitted} />
            </div>
          </div>

          {/* Right Column - Statistics */}
          <div className="lg:col-span-1">
            <StatisticsPanel reports={reports} isLoading={loading} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            Traffic data updates automatically every 5 seconds
          </p>
        </div>
      </footer>
    </div>
  );
}
