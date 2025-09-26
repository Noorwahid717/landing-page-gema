-- Create table to persist classroom project checklists introduced in Next.js roadmap feature
CREATE TABLE "classroom_project_checklists" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "goal" TEXT NOT NULL,
  "skills" JSONB NOT NULL,
  "basicTargets" JSONB NOT NULL,
  "advancedTargets" JSONB NOT NULL,
  "reflectionPrompt" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "classroom_project_checklists_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "classroom_project_checklists_slug_key"
  ON "classroom_project_checklists" ("slug");
