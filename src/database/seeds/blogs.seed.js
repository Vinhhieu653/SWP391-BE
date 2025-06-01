import Blog from '../../models/data/blog.model.js'

const blogs = [
  {
    title: 'Benefits of drinking milk daily',
    content: 'Milk is a great source of calcium, protein, and vitamins. Perfect for all ages.',
    author: 'Health Journal',
    image: 'https://example.com/images/milk-daily.jpg',
    userId: 1
  },
  {
    title: 'Nutrition tips for students',
    content: 'Start your day with breakfast. Add fruits and dairy for energy boost.',
    author: 'School Nurse',
    image: 'https://example.com/images/nutrition-students.jpg',
    userId: 1
  },
  {
    title: 'How to choose the right milk for your child',
    content: 'Check the labels, avoid added sugar, and pick age-appropriate products.',
    author: 'Guardian Blog',
    image: 'https://example.com/images/milk-for-child.jpg',
    userId: 1
  }
]

export async function seedBlogs() {
  for (const blog of blogs) {
    const [instance, created] = await Blog.findOrCreate({
      where: { title: blog.title },
      defaults: {
        content: blog.content,
        author: blog.author,
        image: blog.image,
        userId: blog.userId
      }
    })

    if (created) {
      console.log(`✅ Created blog: ${blog.title}`)
    }
  }
}
