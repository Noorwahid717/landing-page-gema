'use client'

interface SignedUploadParams {
  timestamp: number
  signature: string
  apiKey: string
  cloudName: string
  folder?: string
  publicId?: string
}

interface SignRequestBody {
  folder?: string
  publicId?: string
  resourceType?: 'video' | 'auto' | 'raw'
}

interface UploadOptions extends SignRequestBody {
  fileName?: string
}

interface UploadResult {
  secureUrl: string
  publicId?: string
}

const CLOUDINARY_UPLOAD_ENDPOINT = '/api/upload'

async function getSignedParams(body: SignRequestBody = {}): Promise<SignedUploadParams> {
  const response = await fetch(CLOUDINARY_UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Failed to get Cloudinary signature')
  }

  return (await response.json()) as SignedUploadParams
}

export async function uploadRecordingToCloudinary(file: Blob, options: UploadOptions = {}): Promise<UploadResult> {
  const { folder, publicId, resourceType = 'video', fileName } = options
  const signedParams = await getSignedParams({ folder, publicId, resourceType })

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signedParams.cloudName}/${resourceType}/upload`
  const formData = new FormData()

  formData.append('file', file, fileName ?? `recording-${Date.now()}.webm`)
  formData.append('api_key', signedParams.apiKey)
  formData.append('timestamp', String(signedParams.timestamp))
  formData.append('signature', signedParams.signature)

  if (folder) {
    formData.append('folder', folder)
  }

  if (publicId) {
    formData.append('public_id', publicId)
  }

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    body: formData
  })

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text()
    console.error('Cloudinary upload failed', errorText)
    throw new Error('Cloudinary upload failed')
  }

  const payload = (await uploadResponse.json()) as {
    secure_url: string
    public_id?: string
  }

  return {
    secureUrl: payload.secure_url,
    publicId: payload.public_id
  }
}
