import Blog from '../../models/data/blog.model.js'

// Tạo blog mới
export const createBlogService = async (blogData) => {
  const blog = await Blog.create(blogData)

  return blog
}

// Lấy tất cả blogs
export const getAllBlogsService = async () => {
  const blogs = await Blog.findAll()

  return blogs
}

// Lấy blog theo ID
export const getBlogByIdService = async (id) => {
  const blog = await Blog.findByPk(id)

  if (!blog) throw { status: 404, message: 'Blog not found' }

  return blog
}

// Cập nhật blog
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

// Xoá blog
export const deleteBlogService = async (id) => {
  const blog = await Blog.findByPk(id, { paranoid: false })

  if (!blog || blog.deletedAt) {
    throw { status: 404, message: 'Blog not found or already deleted' }
  }

  await blog.destroy()
  return blog
}
