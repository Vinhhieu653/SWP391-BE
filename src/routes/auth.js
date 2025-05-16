import express from 'express'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'

const router = express.Router()

// Fake user data, hash pass async nên làm ngoài hoặc khởi tạo 1 lần
const users = []

// Mình viết hàm tạo user với pass hash rồi gọi 1 lần
const createUser = async () => {
  const passwordHash = await argon2.hash('123456')
  users.push({ id: 1, username: 'admin', passwordHash })
}
createUser()

const ACCESS_TOKEN_SECRET = 'access-secret'
const REFRESH_TOKEN_SECRET = 'refresh-secret'

let refreshTokens = []

// POST /auth/login
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       description: User credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Returns access token and refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = users.find((u) => u.username === username)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })

  try {
    if (!(await argon2.verify(user.passwordHash, password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' })
  }

  const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

  refreshTokens.push(refreshToken)

  res.json({ accessToken, refreshToken })
})

export default router
