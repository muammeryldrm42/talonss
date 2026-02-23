import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'Talons',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
