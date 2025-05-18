import express from 'express'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import redisClient from '../configs/redisClient.js'
import { apiResponse } from '../middlewares/api-response/responseUtils.js'

const router = express.Router()

const users = []

const createUser = async () => {
  const passwordHash = await argon2.hash('123456')
  users.push({ id: 1, username: 'admin', passwordHash })
}
createUser()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '8h'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
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
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: your.jwt.access.token
 *                     refreshToken:
 *                       type: string
 *                       example: your.jwt.refresh.token
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 401
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *                 data:
 *                   type: null
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Server error
 *                 data:
 *                   type: null
 */

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = users.find((u) => u.username === username)
  if (!user) return apiResponse(res, { status: 401, success: false, message: 'Invalid credentials' })

  try {
    const validPassword = await argon2.verify(user.passwordHash, password)
    if (!validPassword) return apiResponse(res, { status: 401, success: false, message: 'Invalid credentials' })

    const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN })
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })

    // 🧠 Lưu refresh token vô Redis (key = token, value = userId)
    await redisClient.set(refreshToken, user.id.toString(), {
      EX: 7 * 24 * 60 * 60 // 7 ngày
    })

    return apiResponse(res, {
      status: 201,
      message: 'Login successful',
      data: { accessToken, refreshToken }
    })
  } catch (err) {
    return apiResponse(res, { status: 500, success: false, message: 'Server error' })
  }
})

export default router
