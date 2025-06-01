import express from 'express'
import { sendEmailController } from '../../controllers/send-mail/email.controller.js'

const router = express.Router()

/**
 * @swagger
 * /api/v1/send-mail:
 *   post:
 *     summary: Gửi email
 *     tags:
 *       - Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - to
 *               - subject
 *             properties:
 *               to:
 *                 type: string
 *                 format: email
 *                 example: hieudvse172738@fpt.edu.vn
 *                 description: Email người nhận
 *               subject:
 *                 type: string
 *                 example: Test gửi mail
 *                 description: Tiêu đề email
 *               message:
 *                 type: string
 *                 example: "<h1>Đây là nội dung email dạng HTML</h1><p>Nội dung chi tiết...</p>"
 *                 description: Nội dung email (HTML hoặc plain text). Nếu có `template` thì bỏ qua.
 *               template:
 *                 type: string
 *                 example: email-noti
 *                 description: Tên template handlebars dùng để gửi mail.
 *               context:
 *                 type: object
 *                 example: { "studentName": "Hieu", "actionLink": "https://example.com/details" }
 *                 description: Dữ liệu context để thay thế trong template.
 *     responses:
 *       200:
 *         description: Gửi mail thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Gửi mail thành công
 *       400:
 *         description: Thiếu dữ liệu bắt buộc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Thiếu dữ liệu bắt buộc
 *       500:
 *         description: Lỗi server khi gửi mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Gửi mail lỗi
 *                 error:
 *                   type: string
 *                   example: Error message chi tiết
 */

router.post('/send-mail', sendEmailController)

export default router
