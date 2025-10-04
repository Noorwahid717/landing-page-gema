import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

const CLOUDINARY_SECRET = process.env.CLOUDINARY_API_SECRET
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME

if (!CLOUDINARY_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
  console.warn('Cloudinary environment variables are not fully configured')
}

export async function POST(request: NextRequest) {
  if (!CLOUDINARY_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 })
  }

  let body: { folder?: string; publicId?: string } = {}
  try {
    body = await request.json()
  } catch (error) {
    console.warn('Failed to parse Cloudinary sign request body', error)
  }

  const timestamp = Math.round(Date.now() / 1000)
  const params: Record<string, string> = {
    timestamp: String(timestamp)
  }

  if (body.folder) {
    params.folder = body.folder
  }

  if (body.publicId) {
    params.public_id = body.publicId
  }

  const signatureBase = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  const signature = crypto
    .createHash('sha1')
    .update(signatureBase + CLOUDINARY_SECRET)
    .digest('hex')

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: CLOUDINARY_API_KEY,
    cloudName: CLOUDINARY_CLOUD_NAME,
    folder: body.folder,
    publicId: body.publicId
  })
}

export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
