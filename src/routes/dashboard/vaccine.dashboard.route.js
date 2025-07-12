import express from 'express'
import * as controller from '../../controllers/dashboard/vaccine.dashboard.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: VaccineDashboard
 *     description: Dashboard - Thống kê vaccine
 */

/**
 * @swagger
 * /api/v1/dashboard/vaccine/rounds/count:
 *   get:
 *     summary: Tổng số đợt tiêm vaccine
 *     tags: [VaccineDashboard]
 *     responses:
 *       200:
 *         description: Tổng số đợt tiêm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 35
 */
router.get('/rounds/count', controller.countVaccineRounds)

/**
 * @swagger
 * /api/v1/dashboard/vaccine/rounds/status/pending:
 *   get:
 *     summary: Số đợt tiêm đang chờ xác nhận
 *     tags: [VaccineDashboard]
 *     responses:
 *       200:
 *         description: Số đợt pending
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 10
 */
router.get('/rounds/status/pending', controller.countVaccineByStatus('Chờ xác nhận'))

/**
 * @swagger
 * /api/v1/dashboard/vaccine/rounds/status/allowed:
 *   get:
 *     summary: Số đợt tiêm đã được cho phép
 *     tags: [VaccineDashboard]
 *     responses:
 *       200:
 *         description: Số đợt cho phép
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 15
 */
router.get('/rounds/status/allowed', controller.countVaccineByStatus('Cho phép tiêm'))

/**
 * @swagger
 * /api/v1/dashboard/vaccine/rounds/status/injected:
 *   get:
 *     summary: Số đợt đã tiêm
 *     tags: [VaccineDashboard]
 *     responses:
 *       200:
 *         description: Số đợt đã tiêm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 20
 */
router.get('/rounds/status/injected', controller.countVaccineByStatus('Đã tiêm'))

/**
 * @swagger
 * /api/v1/dashboard/vaccine/rounds/status/rejected:
 *   get:
 *     summary: Số đợt không tiêm
 *     tags: [VaccineDashboard]
 *     responses:
 *       200:
 *         description: Số đợt không tiêm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 */
router.get('/rounds/status/rejected', controller.countVaccineByStatus('Không tiêm'))

/**
 * @swagger
 * /api/v1/dashboard/vaccine/rounds/monthly:
 *   get:
 *     summary: Thống kê số đợt tiêm theo từng tháng
 *     tags: [VaccineDashboard]
 *     responses:
 *       200:
 *         description: Mảng dữ liệu theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     format: date
 *                     example: "2025-01-01T00:00:00.000Z"
 *                   count:
 *                     type: integer
 *                     example: 7
 */
router.get('/rounds/monthly', controller.getRoundsByMonth)

/**
 * @swagger
 * /api/v1/dashboard/vaccine/status/count:
 *   get:
 *     summary: Tổng số đợt tiêm theo từng trạng thái
 *     tags: [VaccineDashboard]
 *     responses:
 *       200:
 *         description: Số lượng đợt tiêm theo trạng thái
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countPending:
 *                   type: integer
 *                   example: 10
 *                 countAllowed:
 *                   type: integer
 *                   example: 15
 *                 countInjected:
 *                   type: integer
 *                   example: 20
 *                 countRejected:
 *                   type: integer
 *                   example: 5
 */
router.get('/status/count', controller.countAllVaccineStatuses)

export default router
