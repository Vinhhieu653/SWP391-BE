// seed/category.seed.js
import Category from '../../models/data/category.model.js'

const categories = [
  {Category_id: 1, Name: 'Dinh dưỡng', User_ID: 1 },
  {Category_id: 2, Name: 'Sức khỏe học đường', User_ID: 1 },
  {Category_id: 3, Name: 'Tư vấn bác sĩ', User_ID: 1 }
]

export async function seedCategories() {
  for (const category of categories) {
    const [instance, created] = await Category.findOrCreate({
      where: { Category_id: category.Category_id },
      defaults: {
        Name: category.Name,
        User_ID: category.User_ID,
        Created_at: new Date()
      }
    })

    if (created) {
      console.log(`✅ Created category: ${category.Name}`)
    }
  }
}
