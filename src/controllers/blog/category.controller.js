import {
  createCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService
} from '../../services/blog/category.service.js'

export const createCategoryController = async (req, res) => {
  try {
    const newCategory = await createCategoryService({
      ...req.body,
      Created_at: new Date()
    })

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Category created successfully',
      data: newCategory
    })
  } catch (error) {
    res.status(error.status || 501).json({
      status: error.status || 501,
      success: false,
      message: error.message || 'Server error',
      data: null
    })
  }
}

export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await getAllCategoriesService()

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Categories fetched successfully',
      data: categories
    })
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      success: false,
      message: error.message || 'Server error',
      data: null
    })
  }
}

export const getCategoryByIdController = async (req, res) => {
  try {
    const category = await getCategoryByIdService(req.params.id)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Category fetched successfully',
      data: category
    })
  } catch (error) {
    res.status(error.status || 404).json({
      status: error.status || 404,
      success: false,
      message: error.message || 'Category not found',
      data: null
    })
  }
}

export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const updatedCategory = await updateCategoryService(id, updateData)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    })
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      success: false,
      message: error.message || 'Update failed',
      data: null
    })
  }
}

export const deleteCategoryController = async (req, res) => {
  try {
    const deletedCategory = await deleteCategoryService(req.params.id)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Category deleted successfully',
      data: deletedCategory
    })
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      success: false,
      message: error.message || 'Delete failed',
      data: null
    })
  }
}
