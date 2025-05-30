import Blog from '../../models/data/blog.model.js'

const blogs = [
  {
    title: 'Benefits of drinking milk daily',
    content: 'Milk is a great source of calcium, protein, and vitamins. Perfect for all ages.',
    author: 'Health Journal'
  },
  {
    title: 'Nutrition tips for students',
    content: 'Start your day with breakfast. Add fruits and dairy for energy boost.',
    author: 'School Nurse'
  },
  {
    title: 'How to choose the right milk for your child',
    content: 'Check the labels, avoid added sugar, and pick age-appropriate products.',
    author: 'Guardian Blog'
  }
]

export async function seedBlogs() {
  for (const blog of blogs) {
    const [instance, created] = await Blog.findOrCreate({
      where: { title: blog.title },
      defaults: {
        content: blog.content,
        author: blog.author
      }
    })

    if (created) {
      console.log(`✅ Created blog: ${blog.title}`)
    }
  }
}
