import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('[TEST] Manual cleanup test triggered at:', new Date().toISOString())
    
    // Get current count before deletion
    const currentCount = await prisma.user.count()
    console.log(`[TEST] Current user count: ${currentCount}`)
    
    // Delete all users
    const deletedUsers = await prisma.user.deleteMany({})
    console.log(`[TEST] Deleted ${deletedUsers.count} users`)
    
    return NextResponse.json({ 
      success: true,
      message: 'Manual cleanup completed',
      deletedCount: deletedUsers.count,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[TEST] Manual cleanup failed:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
