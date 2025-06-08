import { Router } from 'express'
import * as ctrl from '../../controllers/health-check/health-check.controller.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   - name: HealthCheck
 *     description: API quản lý khám sức khỏe định kỳ
 */

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
 *             required:
 *               - dateEvent
 *               - schoolYear
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Khám SK định kỳ 2025"
 *               description:
 *                 type: string
 *                 example: "Đợt khám cho học sinh khối 1"
 *               dateEvent:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-15"
 *               schoolYear:
 *                 type: string
 *                 example: "2025-2026"
 *     responses:
 *       200:
 *         description: Đã tạo đợt khám
 */
router.post('/', ctrl.createHealthCheck)

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
 *     responses:
 *       200:
 *         description: Đã gửi form xác nhận
 */
router.post('/:id/send-confirm', ctrl.sendConfirmForms)

/**
 * @swagger
 * /api/v1/health-check/{id}/submit-result:
 *   post:
 *     summary: Y tá nhập kết quả khám cho học sinh
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *             properties:
 *               student_id:
 *                 type: integer
 *                 example: 1
 *               height:
 *                 type: number
 *                 example: 150
 *               weight:
 *                 type: number
 *                 example: 45
 *               blood_pressure:
 *                 type: string
 *                 example: "110/70"
 *               vision_left:
 *                 type: number
 *                 example: 1
 *               vision_right:
 *                 type: number
 *                 example: 0.9
 *               dental_status:
 *                 type: string
 *                 example: "Bình thường"
 *               ent_status:
 *                 type: string
 *                 example: "Bình thường"
 *               skin_status:
 *                 type: string
 *                 example: "Không phát ban"
 *               general_conclusion:
 *                 type: string
 *                 example: "Bình thường"
 *               is_need_meet:
 *                 type: boolean
 *                 example: false
 *               is_confirmed_by_guardian:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Đã lưu kết quả
 */
router.post('/:id/submit-result', ctrl.submitResult)

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
 *     responses:
 *       200:
 *         description: Đã gửi kết quả về phụ huynh
 */
router.post('/:id/send-result', ctrl.sendResult)

/**
 * @swagger
 * tags:
 *   - name: HealthCheck
 *     description: API quản lý khám sức khỏe định kỳ
 */

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
 *             required:
 *               - dateEvent
 *               - schoolYear
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dateEvent:
 *                 type: string
 *                 format: date
 *               schoolYear:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đã tạo đợt khám
 */

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
 *     responses:
 *       200:
 *         description: Đã gửi form xác nhận
 */

/**
 * @swagger
 * /api/v1/health-check/form/{formId}/confirm:
 *   patch:
 *     summary: Phụ huynh xác nhận form khám
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: formId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã xác nhận form
 */

/**
 * @swagger
 * /api/v1/health-check/{id}/submit-result:
 *   post:
 *     summary: Y tá nhập kết quả khám cho học sinh
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *             properties:
 *               student_id:
 *                 type: integer
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               blood_pressure:
 *                 type: string
 *               vision_left:
 *                 type: number
 *               vision_right:
 *                 type: number
 *               dental_status:
 *                 type: string
 *               ent_status:
 *                 type: string
 *               skin_status:
 *                 type: string
 *               general_conclusion:
 *                 type: string
 *               is_need_meet:
 *                 type: boolean
 *               is_confirmed_by_guardian:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Đã lưu kết quả
 */

/**
 * @swagger
 * /api/v1/health-check/{id}/send-result:
 *   post:
 *     summary: Gửi kết quả khám đến phụ huynh
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Đã gửi kết quả về phụ huynh
 */

/**
 * @swagger
 * /api/v1/health-check/{id}/students:
 *   get:
 *     summary: Lấy danh sách học sinh thuộc đợt khám
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách học sinh
 */

/**
 * @swagger
 * /api/v1/health-check/form/{formId}:
 *   get:
 *     summary: Lấy chi tiết kết quả khám của học sinh
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: formId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết form khám
 */

// src/routes/health-check/index.js
router.patch('/form/:formId/confirm', ctrl.confirmForm)
router.get('/:id/students', ctrl.getStudentsByEvent)
router.get('/form/:formId', ctrl.getFormDetail)

export default router
