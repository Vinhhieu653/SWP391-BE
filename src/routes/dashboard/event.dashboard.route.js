import express from 'express'
import * as eventDashboardController from '../../controllers/dashboard/event.dashboard.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: EventDashboard
 *     description: Dashboard - Thống kê sự kiện

 * @swagger
 * /api/v1/dashboard/event/vaccine/monthly:
 *   get:
 *     summary: Tổng số đợt tiêm vaccine theo từng tháng
 *     tags: [EventDashboard]
 *     responses:
 *       200:
 *         description: Thống kê theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2025-03-01T00:00:00.000Z"
 *                   count:
 *                     type: integer
 *                     example: 4
 */
router.get('/vaccine/monthly', eventDashboardController.getVaccineEventsByMonth)

/**
 * @swagger
 * /api/v1/dashboard/event/health-check/monthly:
 *   get:
 *     summary: Tổng số đợt khám sức khỏe theo từng tháng
 *     tags: [EventDashboard]
 *     responses:
 *       200:
 *         description: Thống kê theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2025-05-01T00:00:00.000Z"
 *                   count:
 *                     type: integer
 *                     example: 7
 */
router.get('/health-check/monthly', eventDashboardController.getHealthCheckEventsByMonth)

/**
 * @swagger
 * /api/v1/dashboard/event/other-medical/count:
 *   get:
 *     summary: Tổng số sự kiện y tế khác
 *     tags: [EventDashboard]
 *     responses:
 *       200:
 *         description: Số lượng sự kiện y tế khác
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 10
 */
router.get('/other-medical/count', eventDashboardController.getOtherMedicalCount)

/**
 * @swagger
 * /api/v1/dashboard/event/other-medical/monthly:
 *   get:
 *     summary: Tổng số sự kiện y tế khác theo từng tháng
 *     tags: [EventDashboard]
 *     responses:
 *       200:
 *         description: Thống kê theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: "2025-06-01T00:00:00.000Z"
 *                   count:
 *                     type: integer
 *                     example: 5
 */
router.get('/other-medical/monthly', eventDashboardController.getOtherMedicalCountMonthly)

/**
 * @swagger
 * /api/v1/dashboard/event/admin/count:
 *   get:
 *     summary: Tổng số sự kiện khám sức khỏe
 *     tags: [EventDashboard]
 *     responses:
 *       200:
 *         description: Số lượng sự kiện khám sức khỏe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 15
 */
router.get('/admin/count', eventDashboardController.getDashboardCounts)

/**
 * @swagger
 * /api/v1/dashboard/event/medical-record/count:
 *   get:
 *     summary: Tổng số hồ sơ y tế
 *     tags: [EventDashboard]
 *     responses:
 *       200:
 *         description: Số lượng hồ sơ y tế
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 100
 */
router.get('/medical-record/count', eventDashboardController.getCountMedicalRecord)

export default router
