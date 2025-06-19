import express from 'express'
import { getNotificationsByUser, markNotificationAsRead } from '../controllers/Notification/notifycation.controller.js'
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

/**
 * @swagger
 * /api/v1/notify/mark-read:
 *   put:
 *     summary: Đánh dấu thông báo là đã đọc
 *     tags: [Notify]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Danh sách notificationId cần đánh dấu đã đọc
 *     responses:
 *       200:
 *         description: Đánh dấu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedCount:
 *                   type: integer
 */
router.put('/mark-read', authenticateToken, markNotificationAsRead)

export default router
