import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coordinates, userData } = body;

    // Validate input
    if (!coordinates || !userData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        coordinates,
        userData: userData as any, // Cast to any to avoid type issues with Json field
        // createdAt is automatically set by Prisma due to @default(now())
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}


export async function GET() {
    try {
      const users = await prisma.user.findMany();
      return NextResponse.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }
  }