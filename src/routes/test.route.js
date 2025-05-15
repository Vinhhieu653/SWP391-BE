import express from 'express'
const router = express.Router()

/**
 * @swagger
 * /test:
 *   get:
 *     summary: Trả về chuỗi hello
 *     tags: [Test]
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: hello
 */
router.get('/test', (req, res) => {
  res.send('hello')
})

export default router
