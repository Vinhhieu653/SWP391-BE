import { Router } from 'express'
import * as ctrl from '../../controllers/health-check/health-check.controller.js'
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js'
import multer from 'multer'

const router = Router()
const upload = multer({ dest: 'uploads/' })

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
 */
router.get('/', authenticateToken, authorizeRoles('admin', 'nurse', 'guardian'), ctrl.getHealthChecks)

/**
 * @swagger
 * /api/v1/health-check/student/{studentId}:
 *   get:
 *     summary: Lấy danh sách form khám của học sinh theo ID
 *     tags: [HealthCheck]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của học sinh
 *     responses:
 *       200:
 *         description: Danh sách form khám của học sinh
 *         content:
 *           application/json:
 *             example:
 *               - formId: 12
 *                 eventId: 4
 *                 dateEvent: "2025-06-22"
 *                 type: "Khám tổng quát"
 *                 schoolYear: "2024-2025"
 *                 height: 150
 *                 weight: 45
 *                 bloodPressure: "110/70"
 *                 generalConclusion: "Bình thường"
 *       404:
 *         description: Không tìm thấy dữ liệu
 *         content:
 *           application/json:
 *             example:
 *               message: "Học sinh này chưa tham gia đợt khám nào"
 */
router.get(
  '/student/:studentId',
  authenticateToken,
  authorizeRoles('admin', 'guardian', 'guardian'),
  ctrl.getHealthCheckByStudentId
)

/**
 * @swagger
 * /api/v1/health-check:
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
 */
router.put('/', authenticateToken, authorizeRoles('nurse'), ctrl.updateHealthCheck)

/**
 * @swagger
 * /api/v1/health-check:
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
router.delete('/', authenticateToken, authorizeRoles('nurse'), ctrl.deleteHealthCheck)

/**
 * @swagger
 * /api/v1/health-check/{id}:
 *   get:
 *     summary: Lấy chi tiết một đợt khám sức khỏe
 *     tags: [HealthCheck]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đợt khám sức khỏe
 *     responses:
 *       200:
 *         description: Lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     eventId:
 *                       type: integer
 *                       example: 12
 *                     dateEvent:
 *                       type: string
 *                       format: date
 *                       example: "2025-08-25"
 *                     type:
 *                       type: string
 *                       example: "health check"
 *                     title:
 *                       type: string
 *                       example: "Khám sức khỏe đầu năm lớp 6"
 *                     description:
 *                       type: string
 *                       example: "Đợt khám cho học sinh chuyển cấp khối 6"
 *                     schoolYear:
 *                       type: string
 *                       example: "2025-2026"
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', authenticateToken, authorizeRoles('admin', 'nurse', 'guardian'), ctrl.getHealthCheckById)

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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Đã lưu kết quả
 */
router.post('/:id/submit-result', authenticateToken, authorizeRoles('nurse'), upload.single('image'), ctrl.createdResult)
/**
 * @swagger
 * /api/v1/health-check/{id}/form-result:
 *   get:
 *     summary: Xem chi tiết kết quả khám của học sinh trong đợt khám
 *     tags: [HealthCheck]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đợt khám
 *       - in: query
 *         name: student_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID học sinh
 *     responses:
 *       200:
 *         description: Trả về form kết quả khám
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id/form-result', authenticateToken, authorizeRoles('admin', 'nurse', 'guardian'), ctrl.handleGetForm)

/**
 * @swagger
 * /api/v1/health-check/{id}/form-result/all:
 *   get:
 *     summary: Lấy danh sách toàn bộ form khám của đợt khám
 *     tags: [HealthCheck]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đợt khám
 *     responses:
 *       200:
 *         description: Danh sách form
 *       404:
 *         description: Không tìm thấy đợt khám
 */
router.get(
  '/:id/form-result/all',
  authenticateToken,
  authorizeRoles('admin', 'nurse', 'guardian'),
  ctrl.handleGetAllForms
)
/**
 * @swagger
 * /api/v1/health-check/{id}/form-result:
 *   put:
 *     summary: Cập nhật kết quả khám sức khỏe
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đợt khám
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               status:
 *                 type: string
 *                 example: "approved"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi
 */
router.put('/:id/form-result', authenticateToken, authorizeRoles('nurse'), upload.single('image'), ctrl.handleUpdateForm)

/**
 * @swagger
 * /api/v1/health-check/{id}/form-result:
 *   patch:
 *     summary: Reset kết quả khám của học sinh trong đợt khám
 *     tags: [HealthCheck]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đợt khám
 *       - in: query
 *         name: student_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID học sinh
 *     responses:
 *       200:
 *         description: Reset thành công
 *       400:
 *         description: Lỗi hoặc không tìm thấy
 */

router.patch('/:id/form-result', authenticateToken, authorizeRoles('nurse'), ctrl.handleResetForm)

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
router.get('/:id/students', authenticateToken, authorizeRoles('admin', 'nurse', 'guardian'), ctrl.getStudentsByEvent)

/**
 * @swagger
 * /api/v1/health-check/form/{formId}/confirm:
 *   patch:
 *     summary: Phụ huynh xác nhận hoặc từ chối form khám
 *     tags: [HealthCheck]
 *     parameters:
 *       - name: formId
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
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *                 example: approve
 *     responses:
 *       200:
 *         description: Đã cập nhật trạng thái form
 *       400:
 *         description: Hành động không hợp lệ
 *       404:
 *         description: Không tìm thấy form
 */

router.patch('/form/:formId/confirm', authenticateToken, authorizeRoles('guardian'), ctrl.confirmForm)

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
router.get('/form/:formId', authenticateToken, authorizeRoles('admin', 'nurse', 'guardian'), ctrl.getFormDetail)

export default router
