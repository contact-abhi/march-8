'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface ReportFormProps {
  onSubmitted: () => void;
}

export function ReportForm({ onSubmitted }: ReportFormProps) {
  const [latitude, setLatitude] = useState('40.7128');
  const [longitude, setLongitude] = useState('-74.0060');
  const [trafficLevel, setTrafficLevel] = useState<'low' | 'medium' | 'heavy'>('medium');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          traffic_level: trafficLevel,
          description: description || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSuccess(true);
      setLatitude('40.7128');
      setLongitude('-74.0060');
      setTrafficLevel('medium');
      setDescription('');

      setTimeout(() => setSuccess(false), 3000);
      onSubmitted();
    } catch (err) {
      console.error('[v0] Error submitting report:', err);
      setError('Failed to submit traffic report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLocationName = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg flex gap-2">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 dark:text-green-200">Traffic report submitted successfully!</p>
        </div>
      )}

      {/* Location Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Latitude</label>
          <input
            type="number"
            step="0.0001"
            min="-90"
            max="90"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="40.7128"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Longitude</label>
          <input
            type="number"
            step="0.0001"
            min="-180"
            max="180"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="-74.0060"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
        </div>
      </div>

      {/* Location Display */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">Location: {getLocationName()}</p>
      </div>

      {/* Traffic Level */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Traffic Level</label>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'medium', 'heavy'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setTrafficLevel(level)}
              className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                trafficLevel === level
                  ? level === 'low'
                    ? 'bg-green-500 text-white'
                    : level === 'medium'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">Description (Optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="E.g., Major accident on Broadway near Times Square..."
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Report'
        )}
      </button>
    </form>
  );
}
