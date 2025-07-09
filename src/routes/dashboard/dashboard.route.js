import express from 'express'
import * as dashboardController from '../../controllers/dashboard/dashboard.controller.js'

const router = express.Router()

/**
 * @swagger
 * /api/v1/dashboard/guardian/confirmation-rate:
 *   get:
 *     summary: Tỉ lệ xác nhận từ phụ huynh
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Tỉ lệ phần trăm xác nhận
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 confirmed:
 *                   type: integer
 *                   example: 150
 *                 total:
 *                   type: integer
 *                   example: 200
 *                 percentage:
 *                   type: number
 *                   example: 75.0
 */
router.get('/guardian/confirmation-rate', dashboardController.getGuardianConfirmationRate)

/**
 * @swagger
 * /api/v1/dashboard/users/count:
 *   get:
 *     summary: Tổng số người dùng
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Tổng số user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 300
 */
router.get('/users/count', dashboardController.countUsers)

/**
 * @swagger
 * /api/v1/dashboard/students/count:
 *   get:
 *     summary: Tổng số học sinh
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Tổng số học sinh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 180
 */
router.get('/students/count', dashboardController.countStudents)

/**
 * @swagger
 * /api/v1/dashboard/guardians/count:
 *   get:
 *     summary: Tổng số phụ huynh
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Tổng số phụ huynh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 120
 */
router.get('/guardians/count', dashboardController.countGuardians)

export default router
