// src/app/api/wishes/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wish from '@/models/Wish';
import cache from '@/lib/cache';
import crypto from 'crypto';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    await dbConnect().catch(err => {
      console.error('Database connection failed:', err);
      throw new Error('Database connection failed. Please check MONGODB_URI.');
    });

    const cacheKey = status ? `wishes_${status}` : 'wishes';
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const query = status ? { status } : {};
    const wishes = await Wish.find(query).sort({ createdAt: -1 });
    
    // Lazy expiration logic...
    const now = new Date();
    let changed = false;
    for (const wish of wishes) {
      if (wish.status === 'active' && new Date(wish.deadline) < now) {
        wish.status = 'expired';
        await wish.save();
        changed = true;
      }
    }
    
    if (changed) {
      cache.bust('wishes');
      cache.bust('wishes_active');
      cache.bust('wishes_expired');
    }
    
    cache.set(cacheKey, wishes, 30);
    return NextResponse.json(wishes);
  } catch (error: any) {
    console.error('API [GET] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect().catch(err => {
      console.error('Database connection error:', err);
      throw new Error('Database connection failed. Check your MONGODB_URI environment variable.');
    });

    const body = await request.json();
    
    // Comprehensive validation to prevent 500 errors on missing required fields
    const requiredFields = ['title', 'description', 'creatorAddress', 'targetAmount', 'deadline'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` }, 
          { status: 400 }
        );
      }
    }
    
    // Robust ID generation using native crypto to avoid ESM/CJS compatibility issues
    const stellarMemo = crypto.randomBytes(4).toString('hex').toUpperCase();

    const newWish = await Wish.create({
      ...body,
      stellarMemo,
      status: 'active',
      raisedAmount: 0,
      contributions: []
    });

    cache.bust('wishes');
    cache.bust(`wishes_active`);

    return NextResponse.json(newWish, { status: 201 });
  } catch (error: any) {
    console.error('API [POST] Error Details:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error.message || 'Unknown error occurred',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
