import {
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService
} from '../../services/blog/blog.service.js'

import cloudinary from '../../utils/cloudinary.js'

// [POST] /blogs
export const createBlogController = async (req, res) => {
  try {
    let imageUrl = null
    if (req.file) {
      // up cloudinary ở đây, ví dụ:
      const result = await cloudinary.uploader.upload(req.file.path)
      imageUrl = result.secure_url
    }

    const blog = await createBlogService({
      ...req.body,
      userId: req.user.userId,
      image: imageUrl
    })

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Blog created successfully',
      data: blog
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

// [GET] /blogs
export const getAllBlogsController = async (req, res) => {
  try {
    const blogs = await getAllBlogsService()

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Blogs fetched successfully',
      data: blogs
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

// [GET] /blogs/:id
export const getBlogByIdController = async (req, res) => {
  try {
    const blog = await getBlogByIdService(req.params.id)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Blog fetched successfully',
      data: blog
    })
  } catch (error) {
    res.status(error.status || 404).json({
      status: error.status || 404,
      success: false,
      message: error.message || 'Blog not found',
      data: null
    })
  }
}

// [PUT] /blogs/:id
export const updateBlogController = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    const imageFile = req.file

    console.log('updateData:', updateData)
    console.log('imageFile:', imageFile)

    const blog = await updateBlogService(id, updateData, imageFile)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Blog updated successfully',
      data: blog
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

// [DELETE] /blogs/:id
export const deleteBlogController = async (req, res) => {
  try {
    const deletedBlog = await deleteBlogService(req.params.id)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Blog deleted successfully',
      data: deletedBlog
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
