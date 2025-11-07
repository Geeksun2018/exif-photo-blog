'use client';

/**
 * Conditional wrapper for Vercel Analytics
 * On Cloudflare, this component will gracefully skip analytics
 * On Vercel, it will use @vercel/analytics
 */

const IS_CLOUDFLARE = process.env.NEXT_PUBLIC_PLATFORM === 'cloudflare' || 
                      typeof process !== 'undefined' && process.env.PLATFORM === 'cloudflare';

export function Analytics({ debug = false }: { debug?: boolean }) {
  if (IS_CLOUDFLARE) {
    // On Cloudflare, skip Vercel analytics
    // You can add Cloudflare Web Analytics here if needed
    return null;
  }

  try {
    // Dynamic import for Vercel analytics
    const { Analytics: VercelAnalytics } = require('@vercel/analytics/react');
    return <VercelAnalytics debug={debug} />;
  } catch {
    // If package is not available, gracefully skip
    return null;
  }
}

export function SpeedInsights({ debug = false }: { debug?: boolean }) {
  if (IS_CLOUDFLARE) {
    // On Cloudflare, skip Vercel speed insights
    return null;
  }

  try {
    // Dynamic import for Vercel speed insights
    const { SpeedInsights: VercelSpeedInsights } = require('@vercel/speed-insights/react');
    return <VercelSpeedInsights debug={debug} />;
  } catch {
    // If package is not available, gracefully skip
    return null;
  }
}

