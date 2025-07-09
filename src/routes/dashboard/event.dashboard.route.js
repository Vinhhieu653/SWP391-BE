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

export default router
