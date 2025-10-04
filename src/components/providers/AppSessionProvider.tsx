'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

interface SessionProviderProps {
  children: ReactNode
}

export function AppSessionProvider({ children }: SessionProviderProps) {
  return (
    <SessionProvider 
      refetchInterval={0} 
      refetchOnWindowFocus={true}
      // basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}
