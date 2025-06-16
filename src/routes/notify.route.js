import express from 'express'
import { getNotificationsByUser } from '../controllers/Notification/notifycation.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/v1/notify:
 *   post:
 *     summary: Gửi thông báo realtime
 *     tags: [Notify]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *             example:
 *               title: "Thông báo"
 *               message: "Học sinh bị sốt"
 *     responses:
 *       200:
 *         description: Đã gửi thông báo
 */
router.post('/', (req, res) => {
  const { title, message } = req.body
  req.io.emit('notify', { title, message })
  res.json({ status: 'sent' })
})

/**
 * @swagger
 * /api/v1/notify/user/{userId}:
 *   get:
 *     summary: Lấy danh sách thông báo của người dùng
 *     tags: [Notify]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notifications:
 *                   type: array
 *                 pagination:
 *                   type: object
 *                 unreadCount:
 *                   type: integer
 */
router.get('/user/:userId', authenticateToken, getNotificationsByUser)

export default router
