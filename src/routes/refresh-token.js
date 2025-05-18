import express from 'express'
import jwt from 'jsonwebtoken'
import redisClient from '../configs/redisClient.js'
import { apiResponse } from '../middlewares/api-response/responseUtils.js'

const router = express.Router()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '8h'

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       description: Send refresh token to get new access token
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your.jwt.refresh.token
 *     responses:
 *       200:
 *         description: New access token issued
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
 *                   example: Token refreshed
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: new.jwt.access.token
 *       401:
 *         description: Missing refresh token
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
 *                   example: Missing refresh token
 *       403:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 403
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid or expired token
 */

router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    return apiResponse(res, { status: 401, success: false, message: 'Missing refresh token' })
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    const stored = await redisClient.get(refreshToken)

    if (!stored || stored !== decoded.userId.toString()) {
      return apiResponse(res, { status: 403, success: false, message: 'Invalid refresh token' })
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN
    })

    return apiResponse(res, {
      status: 200,
      success: true,
      message: 'Token refreshed',
      data: { accessToken: newAccessToken }
    })
  } catch (err) {
    return apiResponse(res, { status: 403, success: false, message: 'Invalid or expired token' })
  }
})

export default router
