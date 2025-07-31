import express from 'express'
import * as healthCheckDashboardController from '../../controllers/dashboard/health-check.dashboard.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: HealthCheckDashboard
 *     description: Dashboard - Thống kê khám sức khỏe
 */

/**
 * @swagger
 * /api/v1/dashboard/health-check/rounds/count:
 *   get:
 *     summary: Tổng số đợt khám sức khỏe
 *     tags: [HealthCheckDashboard]
 *     responses:
 *       200:
 *         description: Tổng số đợt khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 12
 */
router.get('/rounds/count', healthCheckDashboardController.getHealthCheckCount)

/**
 * @swagger
 * /api/v1/dashboard/health-check/students/checked:
 *   get:
 *     summary: Tổng số học sinh đã khám sức khỏe
 *     tags: [HealthCheckDashboard]
 *     responses:
 *       200:
 *         description: Số học sinh có kết quả khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 213
 */
router.get('/students/checked', healthCheckDashboardController.getCheckedStudentsCount)

/**
 * @swagger
 * /api/v1/dashboard/health-check/students/checked:
 *   get:
 *     summary: Số học sinh đã khám sức khỏe
 *     tags: [HealthCheckDashboard]
 *     responses:
 *       200:
 *         description: Số học sinh đã khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 213
 */
router.get('/students/checked', healthCheckDashboardController.getCheckedStudentsCount)

/**
 * @swagger
 * /api/v1/dashboard/health-check/students/unchecked:
 *   get:
 *     summary: Số học sinh chưa khám sức khỏe
 *     tags: [HealthCheckDashboard]
 *     responses:
 *       200:
 *         description: Số học sinh chưa khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 74
 */
router.get('/students/unchecked', healthCheckDashboardController.getUncheckedStudentsCount)

/**
 * @swagger
 * /api/v1/dashboard/health-check/students/approved:
 *   get:
 *     summary: Số học sinh đồng ý khám
 *     tags: [HealthCheckDashboard]
 *     responses:
 *       200:
 *         description: Số học sinh approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 150
 */
router.get('/students/approved', healthCheckDashboardController.countCreatedStudents)

/**
 * @swagger
 * /api/v1/dashboard/health-check/students/rejected:
 *   get:
 *     summary: Số học sinh từ chối khám
 *     tags: [HealthCheckDashboard]
 *     responses:
 *       200:
 *         description: Số học sinh rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 45
 */
router.get('/students/rejected', healthCheckDashboardController.countInProgressStudents)

/**
 * @swagger
 * /api/v1/dashboard/health-check/students/pending:
 *   get:
 *     summary: Số học sinh chưa phê duyệt
 *     tags: [HealthCheckDashboard]
 *     responses:
 *       200:
 *         description: Số học sinh pending
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 30
 */
router.get('/students/pending', healthCheckDashboardController.countPendingStudents)

/**
 * @swagger
 * /api/v1/dashboard/health-check/issues/count:
 *   get:
 *     summary: Số học sinh có vấn đề sức khỏe
 *     tags: [HealthCheckDashboard]
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
router.get('/issues/count', healthCheckDashboardController.countHealthIssues)

/**
 * @swagger
 * /api/v1/dashboard/health-check/rounds/statuses:
 *   get:
 *     summary: Tổng hợp các trạng thái đợt khám sức khỏe
 *     tags: [HealthCheckDashboard]
 *     responses:
 *       200:
 *         description: Trạng thái các đợt khám sức khỏe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 created:
 *                   type: integer
 *                   example: 5
 *                 inProgress:
 *                   type: integer
 *                   example: 3
 *                 pending:
 *                   type: integer
 *                   example: 2
 *                 checked:
 *                   type: integer
 *                   example: 12
 */
router.get('/rounds/statuses', healthCheckDashboardController.countAllHealthCheckStatuses)

export default router
