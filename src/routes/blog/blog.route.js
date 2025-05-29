import express from 'express'
import {
    createBlogController,
    getAllBlogsController,
    getBlogByIdController,
    updateBlogController,
    deleteBlogController
} from '../../controllers/blog/blog.controller.js'
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *              
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, authorizeRoles('nurse'), createBlogController)

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: List of blogs
 */
router.get('/', getAllBlogsController)

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog data
 *       404:
 *         description: Blog not found
 */
router.get('/:id', getBlogByIdController)

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   put:
 *     summary: Update a blog by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       404:
 *         description: Blog not found
 */
router.put('/:id', authenticateToken, authorizeRoles('nurse'), updateBlogController)

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       404:
 *         description: Blog not found
 */
router.delete('/:id', authenticateToken, authorizeRoles('nurse'), deleteBlogController)

export default router
