CREATE TABLE "classrooms" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE,
    "description" TEXT,
    "teacherId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "live_sessions" (
    "id" TEXT PRIMARY KEY,
    "classroomId" TEXT NOT NULL,
    "startsAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "endsAt" TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "recordingUrl" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "live_sessions_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "live_sessions_classroomId_idx" ON "live_sessions" ("classroomId");

CREATE TABLE "attendances" (
    "id" TEXT PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "leftAt" TIMESTAMP,
    CONSTRAINT "attendances_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "live_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "attendances_sessionId_studentId_key" ON "attendances" ("sessionId", "studentId");
CREATE INDEX "attendances_studentId_idx" ON "attendances" ("studentId");
