import Blog from '../../models/data/blog.model.js'

export const createBlogService = async (blogData) => {
  const blog = await Blog.create(blogData)

  return blog
}

export const getAllBlogsService = async () => {
  const blogs = await Blog.findAll()

  return blogs
}

export const getBlogByIdService = async (id) => {
  const blog = await Blog.findByPk(id)

  if (!blog) throw { status: 404, message: 'Blog not found' }

  return blog
}

export const updateBlogService = async (id, updateData, imageFile) => {
  const blog = await Blog.findByPk(id)
  if (!blog) throw { status: 404, message: 'Blog not found' }

  if (imageFile) {
    const imageUrl = `/uploads/${imageFile.filename}`
    updateData.image = imageUrl
  }

  await blog.update(updateData)

  return blog
}

export const deleteBlogService = async (id) => {
  const blog = await Blog.findByPk(id, { paranoid: false })

  if (!blog || blog.deletedAt) {
    throw { status: 404, message: 'Blog not found or already deleted' }
  }

  await blog.destroy()
  return blog
}
