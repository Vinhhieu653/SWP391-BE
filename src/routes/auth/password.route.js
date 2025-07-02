import { Router } from 'express'
import * as authController from '../../controllers/auth/password.controller.js'
import { authenticateToken } from '../../middlewares/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Đổi mật khẩu người dùng
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: Login123@
 *               newPassword:
 *                 type: string
 *                 example: Login123@@
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Sai mật khẩu hiện tại hoặc lỗi khác
 *       500:
 *         description: Lỗi server
 */

router.post('/change-password', authenticateToken, authController.changePassword)

/**
 * @swagger
 * /api/v1/auth/send-random-password:
 *   post:
 *     summary: Gửi mật khẩu ngẫu nhiên đến email phụ huynh
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: hieudvse172738@fpt.edu.vn
 *     responses:
 *       200:
 *         description: Gửi email và đổi mật khẩu thành công
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.post('/send-random-password', authController.sendRandomPassword)

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Gửi email đặt lại mật khẩu ngẫu nhiên
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: hieudvse172738@fpt.edu.vn
 *     responses:
 *       200:
 *         description: Đã gửi email reset mật khẩu
 *       400:
 *         description: Email không tồn tại
 *
 */

router.post('/forgot-password', authController.forgotPassword)

export default router
