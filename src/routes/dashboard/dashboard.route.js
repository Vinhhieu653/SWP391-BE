import express from 'express'
import * as dashboardController from '../../controllers/dashboard/dashboard.controller.js'

const router = express.Router()

/**
 * @swagger
 * /api/v1/dashboard/health-checks/count:
 *   get:
 *     summary: Lấy tổng số đợt khám sức khỏe
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Số lượng đợt khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 12
 */
router.get('/health-checks/count', dashboardController.getHealthCheckCount)

/**
 * @swagger
 * /api/v1/dashboard/students/checked:
 *   get:
 *     summary: Số học sinh đã khám sức khỏe
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Số lượng học sinh đã khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 213
 */
router.get('/students/checked', dashboardController.getCheckedStudentsCount)

/**
 * @swagger
 * /api/v1/dashboard/students/unchecked:
 *   get:
 *     summary: Số học sinh chưa khám sức khỏe
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Số lượng học sinh chưa khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 74
 */
router.get('/students/unchecked', dashboardController.getUncheckedStudentsCount)

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

/**
 * @swagger
 * /api/v1/dashboard/health-issues/count:
 *   get:
 *     summary: Đếm số học sinh có vấn đề sức khỏe
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Tổng số học sinh có vấn đề
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 42
 */
router.get('/health-issues/count', dashboardController.countHealthIssues)

export default router
