import express from 'express'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import { apiResponse, notFoundHandler, errorHandler } from '../middlewares/api-response/responseUtils.js'
import redisClient from '../configs/redisClient.js' // nhớ import client Redis

const router = express.Router()
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout, invalidate refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your.jwt.refresh.token
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: Logged out successfully
 *       400:
 *         description: Refresh token missing
 *       500:
 *         description: Server error
 */
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return apiResponse(res, { status: 400, success: false, message: 'Refresh token missing' })
  }

  try {
    const stored = await redisClient.get(refreshToken)
    if (!stored) {
      return apiResponse(res, { status: 400, success: false, message: 'Refresh token invalid or already logged out' })
    }

    await redisClient.del(refreshToken)

    return apiResponse(res, { status: 200, success: true, message: 'Logged out successfully' })
  } catch (err) {
    console.error('Redis error when deleting token:', err)
    return apiResponse(res, { status: 500, success: false, message: 'Server error' })
  }
})

export default router
