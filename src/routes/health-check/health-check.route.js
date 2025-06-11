import { Router } from 'express'
import * as ctrl from '../../controllers/health-check/health-check.controller.js'
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js'
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
 *               type:
 *                 type: string
 *                 example: "health check"
 *     responses:
 *       200:
 *         description: Đã tạo đợt khám
 */
router.post('/', authenticateToken, authorizeRoles('nurse'), ctrl.createHealthCheck)

/**
 * @swagger
 * /api/v1/health-check:
 *   get:
 *     summary: Lấy danh sách đợt khám sức khỏe
 *     tags: [HealthCheck]
 *     responses:
 *       200:
 *         description: Lấy thành công
 *
 *   put:
 *     summary: Cập nhật đợt khám sức khỏe
 *     tags: [HealthCheck]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Khám sức khỏe đầu năm lớp 6"
 *               description:
 *                 type: string
 *                 example: "Đợt khám cho học sinh chuyển cấp khối 6"
 *               dateEvent:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-25"
 *               schoolYear:
 *                 type: string
 *                 example: "2025-2026"
 *               type:
 *                 type: string
 *                 example: "health check"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xoá đợt khám sức khỏe
 *     tags: [HealthCheck]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xoá thành công
 */
router.get('/', authenticateToken, authorizeRoles('nurse'), ctrl.getHealthChecks)
router.put('/', authenticateToken, authorizeRoles('nurse'), ctrl.updateHealthCheck)
router.delete('/', authenticateToken, authorizeRoles('nurse'), ctrl.deleteHealthCheck)

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
router.post('/:id/send-confirm', authenticateToken, authorizeRoles('nurse'), ctrl.sendConfirmForms)

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
router.post('/:id/submit-result', authenticateToken, authorizeRoles('nurse'), ctrl.submitResult)

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
router.post('/:id/send-result', authenticateToken, authorizeRoles('nurse'), ctrl.sendResult)

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
router.patch('/form/:formId/confirm', authenticateToken, authorizeRoles('nurse'), ctrl.confirmForm)

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
router.get('/:id/students', authenticateToken, authorizeRoles('nurse'), ctrl.getStudentsByEvent)

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
router.get('/form/:formId', authenticateToken, authorizeRoles('nurse'), ctrl.getFormDetail)

export default router
