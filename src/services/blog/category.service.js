import Category from '../../models/data/category.model.js'

// Tạo danh mục mới
export const createCategoryService = async (categoryData) => {
  const category = await Category.create(categoryData)
  return category
}

// Lấy tất cả danh mục
export const getAllCategoriesService = async () => {
  const categories = await Category.findAll()
  return categories
}

// Lấy danh mục theo ID
export const getCategoryByIdService = async (id) => {
  const category = await Category.findByPk(id)
  if (!category) throw { status: 404, message: 'Category not found' }
  return category
}

// Cập nhật danh mục
export const updateCategoryService = async (id, updateData) => {
  const category = await Category.findByPk(id)
  if (!category) throw { status: 404, message: 'Category not found' }

  await category.update(updateData)
  return category
}

// Xoá danh mục
export const deleteCategoryService = async (id) => {
  const category = await Category.findByPk(id, { paranoid: false })

  if (!category || category.deletedAt) {
    throw { status: 404, message: 'Category not found or already deleted' }
  }

  await category.destroy()
  return category
}
