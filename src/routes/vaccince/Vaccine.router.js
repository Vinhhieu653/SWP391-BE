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
  getStudentsByEventId,
  updateVaccineStatusByMRId,
  getAllVaccineTypes,
  getVaccineHistoryByVaccineName,
  getVaccineHistoryByGuardianUserId
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
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - MR_ID
 *               - evidence
 *             properties:
 *               MR_ID:
 *                 type: integer
 *                 description: ID hồ sơ y tế
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/VaccineHistory'
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
 * /api/v1/vaccine/vaccine-history/status:
 *   put:
 *     summary: Cập nhật trạng thái tiêm chủng cho nhiều VH_ID
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
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     VH_ID:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       example: Đã tiêm
 *                     note_affter_injection:
 *                       type: string
 *                       example: "Không có phản ứng phụ"
 *                 description: Danh sách cập nhật trạng thái và note cho từng VH_ID
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 */

router.post('/', authenticateToken, authorizeRoles('nurse'), createVaccineHistory)
router.post(
  '/evidence',
  authenticateToken,
  authorizeRoles('guardian'),
  upload.single('evidence'),
  createVaccineWithEvidence
)
router.get('/', getAllVaccineHistory)
router.get('/types', getAllVaccineTypes)
router.get('/medical-record/:mrId', getVaccineHistoryByMRId)
router.get('/event/:eventId/students', getStudentsByEventId)
router.get('/:id', getVaccineHistoryById)
router.put('/:id', authenticateToken, updateVaccineHistory)
router.put('/:id/confirm', authenticateToken, confirmVaccineHistory)
router.put('/vaccine-history/status', authenticateToken, updateVaccineStatusByMRId)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteVaccineHistory)
router.get('/by-name/:vaccineName', getVaccineHistoryByVaccineName)
router.get('/guardian/:guardianUserId', getVaccineHistoryByGuardianUserId)

export default router