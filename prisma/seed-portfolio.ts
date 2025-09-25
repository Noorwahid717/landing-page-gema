import { PrismaClient, PortfolioArtifactType, PortfolioRubricCriterion, PortfolioSubmissionStatus } from '@prisma/client'

export async function seedPortfolio(prisma: PrismaClient) {
  // Ensure there is at least one admin and student to own the sample data
  const admin = await prisma.admin.findFirst({ orderBy: { createdAt: 'asc' } })
  const student = await prisma.student.findFirst({ orderBy: { createdAt: 'asc' } })

  if (!admin || !student) {
    console.warn('⚠️  Skip portfolio seed: admin or student data is missing')
    return
  }

  // Create or reuse the Web Portfolio task for the student class
  const task = await prisma.portfolioTask.upsert({
    where: {
      title_classLevel: {
        title: 'Web Portfolio (HTML, CSS, JS)',
        classLevel: student.class ?? 'XI-A'
      }
    },
    update: {
      description:
        'Kembangkan website portfolio pribadi yang mencerminkan identitas dan karya kamu. Gunakan struktur HTML semantik, styling CSS responsif, dan interaktivitas JavaScript seperlunya.',
      tags: 'web,portfolio,html,css,js',
      instructions:
        'Gunakan 3 panel editor atau unggah ZIP dengan index.html. Pastikan seluruh asset bersifat statis dan total ukuran tidak melebihi 10MB.'
    },
    create: {
      title: 'Web Portfolio (HTML, CSS, JS)',
      description:
        'Kembangkan website portfolio pribadi yang mencerminkan identitas dan karya kamu. Gunakan struktur HTML semantik, styling CSS responsif, dan interaktivitas JavaScript seperlunya.',
      classLevel: student.class ?? 'XI-A',
      tags: 'web,portfolio,html,css,js',
      instructions:
        'Gunakan 3 panel editor atau unggah ZIP dengan index.html. Pastikan seluruh asset bersifat statis dan total ukuran tidak melebihi 10MB.'
    }
  })

  const sampleMetadata = {
    title: 'Portfolio Ahmad Fahreza',
    summary:
      'Website portfolio sederhana dengan hero section, daftar project, dan form kontak interaktif.',
    classLevel: task.classLevel,
    tags: 'hero,project,contact,tailwind'
  }

  const sampleHtml = `<!doctype html>\n<html lang="id">\n<head>\n  <meta charset="utf-8" />\n  <meta name="viewport" content="width=device-width, initial-scale=1" />\n  <title>Portfolio Ahmad Fahreza</title>\n  <link rel="stylesheet" href="styles.css" />\n</head>\n<body>\n  <header class="hero">\n    <h1>Halo, saya Ahmad Fahreza</h1>\n    <p>Calon pengembang web yang senang membangun pengalaman digital intuitif.</p>\n    <button class="cta">Lihat Proyek</button>\n  </header>\n  <main>\n    <section id="projects">\n      <h2>Proyek Unggulan</h2>\n      <article class="project-card">\n        <h3>Aplikasi Jadwal Kelas</h3>\n        <p>Aplikasi web untuk mengelola jadwal kelas dengan kalender interaktif.</p>\n      </article>\n      <article class="project-card">\n        <h3>Landing Page Sekolah</h3>\n        <p>Landing page responsif untuk mempromosikan kegiatan sekolah dan program unggulan.</p>\n      </article>\n    </section>\n  </main>\n  <footer>\n    <form id="contact-form">\n      <h2>Kontak Saya</h2>\n      <label for="email">Email</label>\n      <input id="email" name="email" type="email" required />\n      <label for="message">Pesan</label>\n      <textarea id="message" name="message" rows="4"></textarea>\n      <button type="submit">Kirim</button>\n    </form>\n  </footer>\n  <script src="app.js"></script>\n</body>\n</html>`

  const sampleCss = `:root {\n  color-scheme: light dark;\n}\nbody {\n  margin: 0;\n  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;\n  line-height: 1.6;\n  color: #0f172a;\n  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);\n}\n.hero {\n  padding: 4rem 1.5rem;\n  text-align: center;\n  background: radial-gradient(circle at top, #1d4ed8 0%, #1e293b 100%);\n  color: white;\n}\n.cta {\n  margin-top: 1rem;\n  padding: 0.75rem 1.5rem;\n  font-size: 1rem;\n  border-radius: 9999px;\n  border: none;\n  background: #facc15;\n  color: #0f172a;\n  cursor: pointer;\n}\nmain {\n  max-width: 960px;\n  margin: 0 auto;\n  padding: 3rem 1.5rem;\n}\n.project-card {\n  background: white;\n  border-radius: 1rem;\n  padding: 1.5rem;\n  box-shadow: 0 20px 45px -15px rgba(15, 23, 42, 0.2);\n  margin-bottom: 1.5rem;\n}\n@media (min-width: 768px) {\n  .project-card {\n    display: grid;\n    grid-template-columns: 1fr 2fr;\n    gap: 1.5rem;\n    align-items: start;\n  }\n}`

  const sampleJs = `const form = document.querySelector('#contact-form');\nform?.addEventListener('submit', event => {\n  event.preventDefault();\n  const email = (document.querySelector('#email') as HTMLInputElement)?.value;\n  const message = (document.querySelector('#message') as HTMLTextAreaElement)?.value;\n  if (!email) {\n    alert('Alamat email wajib diisi.');\n    return;\n  }\n  alert(\`Terima kasih, \${email}! Pesan kamu sudah kami terima.\`);\n  form.reset();\n});`

  const submission = await prisma.portfolioSubmission.upsert({
    where: {
      studentId_taskId: {
        studentId: student.id,
        taskId: task.id
      }
    },
    update: {
      ...sampleMetadata,
      status: PortfolioSubmissionStatus.GRADED,
      grade: 92,
      reviewerId: admin.id,
      reviewerNote: 'Tampilan bersih dengan struktur semantik yang konsisten. Tingkatkan performa dengan optimasi asset statis.',
      submittedAt: new Date('2024-10-01T09:00:00Z')
    },
    create: {
      taskId: task.id,
      studentId: student.id,
      ...sampleMetadata,
      status: PortfolioSubmissionStatus.SUBMITTED,
      submittedAt: new Date('2024-10-01T09:00:00Z'),
      draftHtml: sampleHtml,
      draftCss: sampleCss,
      draftJs: sampleJs,
      draftArtifact: PortfolioArtifactType.EDITOR,
      draftMetadata: JSON.stringify({ source: 'seed', panels: ['html', 'css', 'js'] })
    }
  })

  // Ensure we have a locked version snapshot representing the submitted code
  let version = await prisma.portfolioVersion.findFirst({
    where: { submissionId: submission.id },
    orderBy: { createdAt: 'desc' }
  })

  if (!version) {
    version = await prisma.portfolioVersion.create({
      data: {
        submissionId: submission.id,
        title: sampleMetadata.title,
        summary: sampleMetadata.summary,
        classLevel: sampleMetadata.classLevel,
        tags: sampleMetadata.tags,
        html: sampleHtml,
        css: sampleCss,
        js: sampleJs,
        artifactType: PortfolioArtifactType.EDITOR,
        lockedAt: new Date('2024-10-01T09:05:00Z'),
        metadata: JSON.stringify({
          source: 'seed',
          panels: ['html', 'css', 'js']
        })
      }
    })
  }

  // Keep submission pointer to latest version snapshot
  await prisma.portfolioSubmission.update({
    where: { id: submission.id },
    data: {
      lastVersionId: version.id,
      status: PortfolioSubmissionStatus.GRADED,
      grade: 92,
      reviewerId: admin.id,
      reviewerNote:
        'Tampilan bersih dengan struktur semantik yang konsisten. Tingkatkan performa dengan optimasi asset statis.',
      draftHtml: sampleHtml,
      draftCss: sampleCss,
      draftJs: sampleJs,
      draftArtifact: PortfolioArtifactType.EDITOR,
      draftMetadata: JSON.stringify({ source: 'seed', panels: ['html', 'css', 'js'] })
    }
  })

  const existingEvaluation = await prisma.portfolioEvaluation.findUnique({
    where: { versionId: version.id }
  })

  if (!existingEvaluation) {
    const rubric = [
      { criterion: PortfolioRubricCriterion.HTML_STRUCTURE, score: 23, maxScore: 25, comment: 'Header, main, dan footer tersusun rapi.' },
      { criterion: PortfolioRubricCriterion.CSS_RESPONSIVE, score: 24, maxScore: 25, comment: 'Layout responsif dengan grid adaptif.' },
      { criterion: PortfolioRubricCriterion.JS_INTERACTIVITY, score: 22, maxScore: 25, comment: 'Form interaktif sederhana dengan validasi dasar.' },
      { criterion: PortfolioRubricCriterion.CODE_QUALITY, score: 13, maxScore: 15, comment: 'Kode bersih, gunakan lazy loading untuk asset besar.' },
      { criterion: PortfolioRubricCriterion.CREATIVITY_BRIEF, score: 10, maxScore: 10, comment: 'Identitas visual kuat dan sesuai brief.' }
    ]

    const evaluation = await prisma.portfolioEvaluation.create({
      data: {
        submissionId: submission.id,
        versionId: version.id,
        reviewerId: admin.id,
        overallScore: rubric.reduce((total, item) => total + item.score, 0),
        overallNote:
          'Sangat baik! Pertahankan kualitas struktur dan styling. Pertimbangkan menambahkan optimasi gambar untuk mempercepat loading.',
        status: PortfolioSubmissionStatus.GRADED,
        rubricScores: {
          create: rubric
        }
      },
      include: {
        rubricScores: true
      }
    })

    console.log(`✅ Seeded portfolio evaluation with total score ${evaluation.overallScore}`)
  }
}

if (require.main === module) {
  const prisma = new PrismaClient()

  seedPortfolio(prisma)
    .catch(error => {
      console.error('❌ Error seeding portfolio module:', error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}
