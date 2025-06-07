import express from 'express'
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController
} from '../../controllers/blog/category.controller.js'

import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API quản lý danh mục blog
 */

/**
 * @swagger
 * /api/v1/categories:
 *   post:
 *     summary: Tạo danh mục mới
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Name
 *               - User_ID
 *             properties:
 *               Name:
 *                 type: string
 *               User_ID:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không xác thực
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi server
 */
router.post('/', authenticateToken, authorizeRoles('admin'), createCategoryController)

/**
 * @swagger
 * /api/v1/categories:
 *   get:
 *     summary: Lấy danh sách tất cả danh mục
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Danh sách danh mục
 */
router.get('/', getAllCategoriesController)

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   get:
 *     summary: Lấy thông tin danh mục theo ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Thông tin danh mục
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.get('/:id', getCategoryByIdController)

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   put:
 *     summary: Cập nhật danh mục theo ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateCategoryController)

/**
 * @swagger
 * /api/v1/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục theo ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy danh mục
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteCategoryController)

export default router
