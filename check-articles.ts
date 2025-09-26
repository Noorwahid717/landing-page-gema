import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkArticles() {
  const articles = await prisma.article.findMany({
    where: { status: 'published' },
    select: { title: true, slug: true, averageRating: true, totalFeedback: true }
  });

  console.log('Published articles:');
  articles.forEach(a => console.log(`- ${a.title} (slug: ${a.slug}) - Rating: ${a.averageRating}, Feedback: ${a.totalFeedback}`));
  
  await prisma.$disconnect();
}

checkArticles();