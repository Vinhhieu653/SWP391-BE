import express from 'express'
import { loginController } from '../../controllers/auth/login.controller.js'
import { authorizeRoles, authenticateToken } from '../../middlewares/auth.middleware.js'

const router = express.Router()

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
 *                 example: Login123@
 *     responses:
 *       201:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 201
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: admin
 *                         role:
 *                           type: string
 *                           example: admin
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
router.post('/login', loginController)
/**
 * @swagger
 * /api/v1/auth/admin:
 *   get:
 *     summary: Check admin role access
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Chỉ admin mới xem được
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chỉ admin mới xem được
 *       '401':
 *         description: Unauthorized / Token invalid
 *       '403':
 *         description: Forbidden / Role không đủ
 */

router.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({ message: 'Chỉ admin mới xem được' })
})
/**
 * @swagger
 * /api/v1/auth/nurse:
 *   get:
 *     summary: Check nurse role access
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Chỉ nurse mới xem được
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chỉ nurse mới xem được
 *       '401':
 *         description: Unauthorized / Token invalid
 *       '403':
 *         description: Forbidden / Role không đủ
 */

router.get('/nurse', authenticateToken, authorizeRoles('nurse'), (req, res) => {
  res.status(200).json({ message: 'Chỉ nurse mới xem được' })
})
/**
 * @swagger
 * /api/v1/auth/student:
 *   get:
 *     summary: Check student role access
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Chỉ student mới xem được
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chỉ student mới xem được
 *       '401':
 *         description: Unauthorized / Token invalid
 *       '403':
 *         description: Forbidden / Role không đủ
 */

router.get('/student', authenticateToken, authorizeRoles('student'), (req, res) => {
  res.status(200).json({ message: 'Chỉ student mới xem được' })
})
/**
 * @swagger
 * /api/v1/auth/parent:
 *   get:
 *     summary: Check parent role access
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Chỉ parent mới xem được
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chỉ parent mới xem được
 *       '401':
 *         description: Unauthorized / Token invalid
 *       '403':
 *         description: Forbidden / Role không đủ
 */

router.get('/parent', authenticateToken, authorizeRoles('parent'), (req, res) => {
  res.status(200).json({ message: 'Chỉ parent mới xem được' })
})
export default router
