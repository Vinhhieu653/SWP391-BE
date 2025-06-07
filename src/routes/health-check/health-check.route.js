import { Router } from 'express'
import * as ctrl from '../../controllers/health-check/health-check.controller.js'

const router = Router()

// 1. Tạo đợt khám
/**
 * @swagger
 * /api/v1/health-check:
 *   post:
 *     summary: Tạo đợt khám sức khỏe
 *     tags: [HealthCheck]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Khám SK định kỳ 2025"
 *               description:
 *                 type: string
 *                 example: "Đợt khám cho học sinh khối 1"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-15"
 *             required:
 *               - date
 *     responses:
 *       200:
 *         description: Đã tạo đợt khám
 */
router.post('/', ctrl.createHealthCheck)

// 2. Gửi form xác nhận cho PH
/**
 * @swagger
 * /api/v1/health-check/{id}/send-confirm:
 *   post:
 *     summary: Gửi form xác nhận đến phụ huynh
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID đợt khám
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Đã gửi form xác nhận
 */
router.post('/:id/send-confirm', ctrl.sendConfirmForms)

// 4. Y tá submit kết quả
/**
 * @swagger
 * /api/v1/health-check/{id}/submit-result:
 *   post:
 *     summary: Y tá gửi kết quả khám cho học sinh
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID đợt khám
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: integer
 *                 example: 10
 *               result:
 *                 type: object
 *                 properties:
 *                   height:
 *                     type: number
 *                     example: 150
 *                   weight:
 *                     type: number
 *                     example: 45
 *                   vision:
 *                     type: string
 *                     example: "10/10"
 *               status:
 *                 type: string
 *                 example: "normal"
 *               note:
 *                 type: string
 *                 example: "Ổn"
 *             required:
 *               - student_id
 *               - result
 *               - status
 *     responses:
 *       200:
 *         description: Đã lưu kết quả
 */
router.post('/:id/submit-result', ctrl.submitResult)

// 5. Gửi kết quả về PH
/**
 * @swagger
 * /api/v1/health-check/{id}/send-result:
 *   post:
 *     summary: Gửi kết quả khám đến phụ huynh
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID đợt khám
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Đã gửi kết quả về phụ huynh
 */
router.post('/:id/send-result', ctrl.sendResult)

export default router
