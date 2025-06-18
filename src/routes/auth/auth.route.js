import { Router } from 'express'
import * as authController from '../../controllers/auth/auth.controller.js'
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

export default router
