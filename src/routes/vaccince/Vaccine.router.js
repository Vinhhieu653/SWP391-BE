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
  getVaccineHistoryByGuardianUserId,
  deleteVaccineHistoriesByNameDateGrade
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
 *     summary: Lấy danh sách tất cả lịch sử tiêm chủng (trả kèm khối lớp grade)
 *     tags: [Vaccine]
 *     responses:
 *       200:
 *         description: Danh sách lịch sử tiêm chủng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   VH_ID:
 *                     type: integer
 *                   Vaccine_name:
 *                     type: string
 *                   Vaccince_type:
 *                     type: string
 *                   Date_injection:
 *                     type: string
 *                   grade:
 *                     type: integer
 *                   # ... các trường khác ...
 *   post:
 *     summary: Tạo mới lịch sử tiêm chủng (Chỉ dành cho Y tá, lọc theo khối lớp, không tạo nếu đã tiêm cùng tên vaccine)
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
 *               Grade:
 *                 type: string
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
 *               - ID
 *               - evidence
 *             properties:
 *               ID:
 *                 type: integer
 *                 description: ID hồ sơ y tế
 *               Vaccine_name:
 *                 type: string
 *               Vaccince_type:
 *                 type: string
 *               Date_injection:
 *                 type: string
 *                 format: date-time
 *               note_affter_injection:
 *                type: string
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

/**
 * @swagger
 * /api/v1/vaccine/types:
 *   get:
 *     summary: Lấy danh sách tất cả loại vaccine
 *     tags: [Vaccine]
 *     responses:
 *       200:
 *         description: Danh sách loại vaccine
 */

/**
 * @swagger
 * /api/v1/vaccine/event/{eventId}/students:
 *   get:
 *     summary: Lấy danh sách học sinh theo sự kiện tiêm chủng
 *     tags: [Vaccine]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách học sinh
 */

/**
 * @swagger
 * /api/v1/vaccine/by-name/{vaccineName}:
 *   get:
 *     summary: Lấy lịch sử tiêm chủng theo tên vaccine, khối (grade) và ngày event
 *     tags: [Vaccine]
 *     parameters:
 *       - in: path
 *         name: vaccineName
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: grade
 *         required: false
 *         schema:
 *           type: integer
 *         description: Lọc theo khối lớp (grade)
 *       - in: query
 *         name: eventDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Lọc theo ngày event (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Danh sách lịch sử tiêm chủng theo tên vaccine, khối và ngày event
 */

/**
 * @swagger
 * /api/v1/vaccine/guardian/{guardianUserId}:
 *   get:
 *     summary: Lấy lịch sử tiêm chủng theo userId của phụ huynh
 *     tags: [Vaccine]
 *     parameters:
 *       - in: path
 *         name: guardianUserId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách lịch sử tiêm chủng của phụ huynh
 */

/**
 * @swagger
 * /api/v1/vaccine/delete-by-name-date-grade:
 *   delete:
 *     summary: Xóa nhiều lịch sử tiêm chủng theo tên vaccine và ngày tiêm (Chỉ dành cho Nurse)
 *     tags: [Vaccine]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vaccineName
 *               - dateInjection
 *             properties:
 *               vaccineName:
 *                 type: string
 *                 description: Tên vaccine
 *               dateInjection:
 *                 type: string
 *                 format: date
 *                 description: Ngày tiêm (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Xóa thành công các lịch sử tiêm chủng phù hợp
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
 *                     deletedCount:
 *                       type: integer
 */

router.post('/', authenticateToken, authorizeRoles('nurse'), createVaccineHistory)
router.post(
  '/evidence',
  authenticateToken,
  authorizeRoles('guardian'),
  upload.single('evidence'),
  createVaccineWithEvidence
)
router.get('/', authenticateToken, authorizeRoles('nurse'), getAllVaccineHistory)
router.get('/types', authenticateToken, authorizeRoles('nurse'), getAllVaccineTypes)
router.get('/medical-record/:mrId', authenticateToken, authorizeRoles('nurse', 'guardian'), getVaccineHistoryByMRId)
router.get('/event/:eventId/students', authenticateToken, authorizeRoles('nurse'), getStudentsByEventId)
router.get('/:id', authenticateToken, authorizeRoles('nurse'), getVaccineHistoryById)
router.put('/:id', authenticateToken, updateVaccineHistory)
router.put('/:id/confirm', authenticateToken, confirmVaccineHistory)
router.put('/vaccine-history/status', authenticateToken, updateVaccineStatusByMRId)
router.delete(
  '/delete-by-name-date-grade',
  authenticateToken,
  authorizeRoles('nurse'),
  deleteVaccineHistoriesByNameDateGrade
)
router.delete('/:id', authenticateToken, authorizeRoles('nurse'), deleteVaccineHistory)
router.get('/by-name/:vaccineName', getVaccineHistoryByVaccineName)
router.get('/guardian/:guardianUserId', getVaccineHistoryByGuardianUserId)

export default router
