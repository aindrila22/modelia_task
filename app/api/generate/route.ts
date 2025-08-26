import { NextRequest, NextResponse } from 'next/server';
import { GenerateRequest, GenerateResponse, GenerateError } from '../../types';

// Mock image URLs for demonstration
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
];

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    
    // Validate request
    if (!body.imageDataUrl || !body.prompt || !body.style) {
      return NextResponse.json(
        { message: 'Missing required fields' } as GenerateError,
        { status: 400 }
      );
    }

    // Simulate processing delay (1-2 seconds)
    const delay = Math.random() * 1000 + 1000; // 1-2 seconds
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulate 20% error rate
    if (Math.random() < 0.2) {
      return NextResponse.json(
        { message: 'Model overloaded' } as GenerateError,
        { status: 503 }
      );
    }

    // Generate mock response
    const response: GenerateResponse = {
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      imageUrl: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
      prompt: body.prompt,
      style: body.style,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Generation API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' } as GenerateError,
      { status: 500 }
    );
  }
}
