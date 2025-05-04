import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function GET() {
  // Replace this URL with your actual Google Drive video demo link
  return NextResponse.redirect('https://drive.google.com/file/d/1uCoZrJbsDpJr-dUyRZnGTT22wuB2AqNv/view?usp=sharing')
} 