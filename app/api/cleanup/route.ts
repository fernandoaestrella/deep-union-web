import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const deletedUsers = await prisma.user.deleteMany({})
  return NextResponse.json({ deletedCount: deletedUsers.count })
}