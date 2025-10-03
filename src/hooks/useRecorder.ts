'use client'

import { useCallback, useRef, useState } from 'react'

type UseRecorderOptions = {
  mimeType?: string
}

type UseRecorderResult = {
  isRecording: boolean
  isProcessing: boolean
  error: string | null
  startRecording: (stream: MediaStream) => Promise<void>
  stopRecording: () => Promise<Blob | null>
  reset: () => void
}

export function useRecorder(options: UseRecorderOptions = {}): UseRecorderResult {
  const mimeType = options.mimeType ?? 'video/webm;codecs=vp9,opus'
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setIsRecording(false)
    setIsProcessing(false)
    setError(null)
    chunksRef.current = []
    if (recorderRef.current) {
      recorderRef.current.ondataavailable = null
      recorderRef.current.onstop = null
      recorderRef.current.onerror = null
      recorderRef.current = null
    }
  }, [])

  const startRecording = useCallback(
    async (stream: MediaStream) => {
      if (typeof window === 'undefined') return

      if (!stream) {
        setError('Stream is not available for recording')
        return
      }

      if (isRecording) {
        setError('Recorder is already running')
        return
      }

      try {
        const recorder = new MediaRecorder(stream, { mimeType })
        chunksRef.current = []

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data)
          }
        }

        recorder.onerror = (event) => {
          console.error('MediaRecorder error', event)
          setError('Recording error occurred')
        }

        recorder.onstop = () => {
          setIsRecording(false)
          setIsProcessing(false)
        }

        recorder.start(2000)
        recorderRef.current = recorder
        setIsRecording(true)
        setError(null)
      } catch (err) {
        console.error('Failed to start recorder', err)
        setError('Tidak dapat memulai perekaman')
        reset()
      }
    },
    [isRecording, mimeType, reset]
  )

  const stopRecording = useCallback(async () => {
    if (!recorderRef.current) {
      setError('Recorder is not active')
      return null
    }

    return new Promise<Blob | null>((resolve) => {
      try {
        setIsProcessing(true)
        recorderRef.current!.onstop = () => {
          setIsRecording(false)
          setIsProcessing(false)
          const blob = chunksRef.current.length
            ? new Blob(chunksRef.current, { type: mimeType })
            : null
          resolve(blob)
          chunksRef.current = []
          recorderRef.current = null
        }

        recorderRef.current!.stop()
      } catch (err) {
        console.error('Failed to stop recorder', err)
        setError('Gagal menghentikan perekaman')
        resolve(null)
      }
    })
  }, [mimeType])

  return {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    reset
  }
}
