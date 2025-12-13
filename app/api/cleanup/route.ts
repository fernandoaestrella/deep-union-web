import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Force dynamic rendering - critical for cron jobs to work properly
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const startTime = Date.now()
  console.log('[CRON] Cleanup job started at:', new Date().toISOString())

  try {
    // Optional: Verify CRON_SECRET for security
    // Uncomment these lines after setting CRON_SECRET in Vercel environment variables
    // const authHeader = request.headers.get('authorization')
    // const cronSecret = process.env.CRON_SECRET
    // if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    //   console.log('[CRON] Unauthorized access attempt')
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Delete all user records
    const deletedUsers = await prisma.user.deleteMany({})
    
    const duration = Date.now() - startTime
    console.log(`[CRON] Successfully deleted ${deletedUsers.count} users in ${duration}ms`)
    
    return NextResponse.json({ 
      success: true,
      deletedCount: deletedUsers.count,
      timestamp: new Date().toISOString(),
      durationMs: duration
    })
  } catch (error) {
    const duration = Date.now() - startTime
    console.error('[CRON] Cleanup job failed:', error)
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      durationMs: duration
    }, { status: 500 })
  }
}