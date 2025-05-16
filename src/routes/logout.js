import express from 'express'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import { apiResponse, notFoundHandler, errorHandler } from '../middlewares/api-response/responseUtils.js'

const router = express.Router()

const users = []

const createUser = async () => {
    const passwordHash = await argon2.hash('123456')
    users.push({ id: 1, username: 'admin', passwordHash })
}
createUser()

let refreshTokens = []
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
router.post('/logout', (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return apiResponse(res, { status: 400, success: false, message: 'Refresh token missing' })
    }

    refreshTokens = refreshTokens.filter(token => token !== refreshToken)

    return apiResponse(res, { status: 200, success: true, message: 'Logged out successfully' })
})
export default router