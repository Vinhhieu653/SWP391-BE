import Category from '../../models/data/category.model.js'

export const createCategoryService = async (categoryData) => {
  const category = await Category.create(categoryData)
  return category
}

export const getAllCategoriesService = async () => {
  const categories = await Category.findAll()
  return categories
}

export const getCategoryByIdService = async (id) => {
  const category = await Category.findByPk(id)
  if (!category) throw { status: 404, message: 'Category not found' }
  return category
}

export const updateCategoryService = async (id, updateData) => {
  const category = await Category.findByPk(id)
  if (!category) throw { status: 404, message: 'Category not found' }

  await category.update(updateData)
  return category
}

export const deleteCategoryService = async (id) => {
  const category = await Category.findByPk(id, { paranoid: false })

  if (!category || category.deletedAt) {
    throw { status: 404, message: 'Category not found or already deleted' }
  }

  await category.destroy()
  return category
}
