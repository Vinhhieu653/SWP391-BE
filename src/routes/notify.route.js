import express from 'express'
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

export default router
