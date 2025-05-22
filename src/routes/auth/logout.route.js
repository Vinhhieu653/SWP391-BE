import express from 'express'
import { body } from 'express-validator'
import logoutController from '../../controllers/auth/logout.controller.js'

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
 *       400:
 *         description: Invalid or missing refresh token
 *       500:
 *         description: Server error
 */
router.post(
  '/logout',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required')
      .matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
      .withMessage('Invalid refresh token format')
  ],
  logoutController
)

export default router
