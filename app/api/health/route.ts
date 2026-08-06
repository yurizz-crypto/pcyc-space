import { NextResponse } from 'next/server';
import { createModuleLogger } from '@/lib/logger';

const log = createModuleLogger('observability:health');

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const uptime = process.uptime();

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'pcyc-space',
    version: process.env.npm_package_version || '0.1.0',
    uptimeSeconds: Math.floor(uptime),
    nodeEnv: process.env.NODE_ENV || 'development',
    responseTimeMs: Date.now() - startTime,
  };

  log.debug({ healthData }, 'Health check probe executed');

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
