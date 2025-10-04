import type { Prisma, PrismaClient } from '@prisma/client'

type LiveSessionDelegate = Prisma.LiveSessionDelegate

/**
 * Safely access the LiveSession delegate even when PrismaClient types
 * were generated from an outdated schema (as seen in some CI builds).
 */
export function ensureLiveSessionDelegate(client: PrismaClient): LiveSessionDelegate {
  return (client as unknown as { liveSession: LiveSessionDelegate }).liveSession
}
