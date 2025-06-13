import express from 'express'
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js'
import multer from 'multer'
import {
  createVaccineHistory,
  createVaccineWithEvidence,
  getAllVaccineHistory,
  getVaccineHistoryById,
  getVaccineHistoryByMRId,
  updateVaccineHistory,
  confirmVaccineHistory,
  deleteVaccineHistory,
  getStudentsByEventId
} from '../../controllers/Vaccine/Vaccince.controller.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

/**
 * @swagger
 * tags:
 *   name: Vaccine
 *   description: API quản lý tiêm chủng
 */

/**
 * @swagger
 * /api/v1/vaccine:
 *   get:
 *     summary: Lấy danh sách tất cả lịch sử tiêm chủng
 *     tags: [Vaccine]
 *     responses:
 *       200:
 *         description: Danh sách lịch sử tiêm chủng
 *
 *   post:
 *     summary: Tạo mới lịch sử tiêm chủng (Chỉ dành cho Y tá)
 *     tags: [Vaccine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Vaccine_name:
 *                 type: string
 *               Vaccince_type:
 *                 type: string
 *               Date_injection:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       type: object
 *                     vaccineHistories:
 *                       type: array
 *
 * /api/v1/vaccine/{id}:
 *   get:
 *     summary: Lấy chi tiết lịch sử tiêm chủng theo ID
 *     tags: [Vaccine]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chi tiết lịch sử tiêm chủng
 *
 *   put:
 *     summary: Cập nhật lịch sử tiêm chủng
 *     tags: [Vaccine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
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
 *               Vaccine_name:
 *                 type: string
 *               Vaccince_type:
 *                 type: string
 *               Date_injection:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *
 *   delete:
 *     summary: Xóa lịch sử tiêm chủng (Chỉ dành cho Admin)
 *     tags: [Vaccine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *
 * /api/v1/vaccine/evidence:
 *   post:
 *     summary: Tạo mới lịch sử tiêm chủng kèm bằng chứng (Chỉ dành cho Phụ huynh)
 *     tags: [Vaccine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - MR_ID
 *               - evidence
 *             properties:
 *               Vaccine_name:
 *                 type: string
 *               Vaccince_type:
 *                 type: string
 *               Date_injection:
 *                 type: string
 *               evidence:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo thành công với bằng chứng
 *
 * /api/v1/vaccine/medical-record/{mrId}:
 *   get:
 *     summary: Lấy lịch sử tiêm chủng theo ID hồ sơ y tế
 *     tags: [Vaccine]
 *     parameters:
 *       - in: path
 *         name: mrId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách lịch sử tiêm chủng
 *
 * /api/v1/vaccine/{id}/confirm:
 *   put:
 *     summary: Xác nhận lịch sử tiêm chủng
 *     tags: [Vaccine]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xác nhận thành công
 *
 * /api/v1/vaccine/event/{eventId}/students:
 *   get:
 *     summary: Lấy danh sách học sinh và trạng thái xác nhận theo Event ID
 *     tags: [Vaccine]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 eventId:
 *                   type: integer
 *                 totalStudents:
 *                   type: integer
 *                 confirmedCount:
 *                   type: integer
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       studentId:
 *                         type: integer
 *                       fullname:
 *                         type: string
 *                       class:
 *                         type: string
 *                       vaccineHistory:
 *                         type: object
 */

router.post('/', authenticateToken, authorizeRoles('nurse'), createVaccineHistory)
router.post('/evidence', authenticateToken, authorizeRoles('guardian'), upload.single('evidence'), createVaccineWithEvidence)
router.get('/', getAllVaccineHistory)
router.get('/medical-record/:mrId', getVaccineHistoryByMRId)
router.get('/event/:eventId/students', getStudentsByEventId)
router.get('/:id', getVaccineHistoryById)
router.put('/:id', authenticateToken, updateVaccineHistory)
router.put('/:id/confirm', authenticateToken, confirmVaccineHistory)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteVaccineHistory)

export default router
