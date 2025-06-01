import Blog from '../../models/data/blog.model.js'
import User from '../../models/data/user.model.js' // bạn cần import model User để tìm user

const blogs = [
  {
    title: 'Benefits of drinking milk daily',
    content: 'Milk is a great source of calcium, protein, and vitamins. Perfect for all ages.',
    author: 'nurse1',
    image: 'https://example.com/images/milk-daily.jpg'
  },
  {
    title: 'Nutrition tips for students',
    content: 'Start your day with breakfast. Add fruits and dairy for energy boost.',
    author: 'student1',
    image: 'https://example.com/images/nutrition-students.jpg'
  },
  {
    title: 'How to choose the right milk for your child',
    content: 'Check the labels, avoid added sugar, and pick age-appropriate products.',
    author: 'nurse1',
    image: 'https://example.com/images/milk-for-child.jpg'
  }
]

export async function seedBlogs() {
  for (const blog of blogs) {
    // tìm user theo name hoặc email giống author
    const user = await User.findOne({ where: { username: blog.author } })

    if (!user) {
      console.warn(`❌ Không tìm thấy user tên: ${blog.author}, bỏ qua blog này.`)
      continue
    }

    const [instance, created] = await Blog.findOrCreate({
      where: { title: blog.title },
      defaults: {
        content: blog.content,
        userId: user.id,
        image: blog.image
      }
    })

    if (created) {
      console.log(`✅ Created blog: ${blog.title} by ${blog.author}`)
    }
  }
}
