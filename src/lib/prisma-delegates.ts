import type { Prisma, PrismaClient } from '@prisma/client'

type KnownDelegates = {
  classroom: Prisma.ClassroomDelegate
  liveSession: Prisma.LiveSessionDelegate
}

function ensureDelegate<K extends keyof KnownDelegates>(
  client: PrismaClient,
  key: K
): KnownDelegates[K] {
  return (client as unknown as KnownDelegates)[key]
}

/**
 * Safely access the LiveSession delegate even when PrismaClient types
 * were generated from an outdated schema (as seen in some CI builds).
 */
export function ensureLiveSessionDelegate(client: PrismaClient): Prisma.LiveSessionDelegate {
  return ensureDelegate(client, 'liveSession')
}

/**
 * Safely access the Classroom delegate when PrismaClient typings lag
 * behind the schema during remote builds.
 */
export function ensureClassroomDelegate(client: PrismaClient): Prisma.ClassroomDelegate {
  return ensureDelegate(client, 'classroom')
}
