import {
  createBlogService,
  getAllBlogsService,
  getBlogByIdService,
  updateBlogService,
  deleteBlogService
} from '../../services/blog/blog.service.js'

import cloudinary from '../../utils/cloudinary.js'

export const createBlogController = async (req, res) => {
  try {
    let imageUrl = null
    if (req.file) {
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

export const updateBlogController = async (req, res) => {
  try {
    console.log('req.body', req.file.path)

    const { id } = req.params
    const updateData = { ...req.body }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      updateData.image = result.secure_url
    }

    const blog = await updateBlogService(id, updateData)

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

export const deleteBlogController = async (req, res) => {
  try {
    await deleteBlogService(req.params.id)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Blog deleted successfully',
      data: null
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
