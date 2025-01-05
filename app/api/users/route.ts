import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { coordinates, userData } = body;

    const user = await prisma.user.create({
      data: {
        coordinates,
        userData: userData as any, // Cast to any to avoid type issues with Json field
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