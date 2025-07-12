import express from 'express'
import * as medicineDashboardController from '../../controllers/dashboard/medicine.dashboard.controller.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: MedicineDashboard
 *     description: Dashboard - Gửi thuốc
 */

/**
 * @swagger
 * /api/v1/dashboard/medicine/prescriptions/total:
 *   get:
 *     summary: Tổng số đơn thuốc
 *     tags: [MedicineDashboard]
 *     responses:
 *       200:
 *         description: Tổng số đơn thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 80
 */
router.get('/prescriptions/total', medicineDashboardController.countTotalPrescriptions)

/**
 * @swagger
 * /api/v1/dashboard/medicine/prescriptions/pending:
 *   get:
 *     summary: Số đơn thuốc chưa xác nhận
 *     tags: [MedicineDashboard]
 *     responses:
 *       200:
 *         description: Số đơn thuốc pending
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 20
 */
router.get('/prescriptions/pending', medicineDashboardController.countPendingPrescriptions)

/**
 * @swagger
 * /api/v1/dashboard/medicine/prescriptions/received:
 *   get:
 *     summary: Số đơn thuốc đã nhận
 *     tags: [MedicineDashboard]
 *     responses:
 *       200:
 *         description: Số đơn thuốc received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 25
 */
router.get('/prescriptions/received', medicineDashboardController.countReceivedPrescriptions)

/**
 * @swagger
 * /api/v1/dashboard/medicine/prescriptions/rejected:
 *   get:
 *     summary: Số đơn thuốc bị từ chối
 *     tags: [MedicineDashboard]
 *     responses:
 *       200:
 *         description: Số đơn thuốc rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 10
 */
router.get('/prescriptions/rejected', medicineDashboardController.countRejectedPrescriptions)

/**
 * @swagger
 * /api/v1/dashboard/medicine/prescriptions/given:
 *   get:
 *     summary: Số đơn thuốc đã phát
 *     tags: [MedicineDashboard]
 *     responses:
 *       200:
 *         description: Số đơn thuốc given
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 25
 */
router.get('/prescriptions/given', medicineDashboardController.countGivenPrescriptions)


/**
 * @swagger
 * /api/v1/dashboard/medicine/prescriptions/statuses:
 *   get:
 *     summary: Tổng hợp các trạng thái đơn thuốc
 *     tags: [MedicineDashboard]
 *     responses:
 *       200:
 *         description: Trạng thái đơn thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 countPending:
 *                   type: integer
 *                   example: 10
 *                 countReceived:
 *                   type: integer
 *                   example: 5
 *                 countRejected:
 *                   type: integer
 *                   example: 3
 *                 countGiven:
 *                   type: integer
 *                   example: 8
 */
router.get('/prescriptions/statuses', medicineDashboardController.countAllPrescriptionStatuses);


export default router
