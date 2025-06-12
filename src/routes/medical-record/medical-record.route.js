import express from 'express'
import {
  createMedicalRecord,
  getAllMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../../controllers/medical-record/medical-record.controler.js'
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: MedicalRecord
 *   description: API quản lý hồ sơ y tế
 */

/**
 * @swagger
 * /api/v1/medical-records:
 *   get:
 *     summary: Lấy tất cả hồ sơ y tế
 *     tags: [MedicalRecord]
 *     responses:
 *       200:
 *         description: Danh sách hồ sơ y tế
 */
router.get('/', getAllMedicalRecords)

/**
 * @swagger
 * /api/v1/medical-records/{id}:
 *   get:
 *     summary: Lấy hồ sơ y tế theo ID
 *     tags: [MedicalRecord]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin hồ sơ y tế
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', getMedicalRecordById)

/**
 * @swagger
 * /api/v1/medical-records:
 *   post:
 *     summary: Tạo mới hồ sơ y tế
 *     tags: [MedicalRecord]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - bloodType
 *               - height
 *               - weight
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               bloodType:
 *                 type: string
 *                 example: "O+"
 *               height:
 *                 type: number
 *                 example: 120
 *               weight:
 *                 type: number
 *                 example: 30
 *               vaccines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "BCG"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2018-06-01"
 *                     status:
 *                       type: string
 *                       example: "Đã tiêm"
 *               chronicDiseases:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Hen suyễn nhẹ"
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tôm cua"
 *               pastIllnesses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     disease:
 *                       type: string
 *                       example: "Viêm phổi"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2020-12-10"
 *                     treatment:
 *                       type: string
 *                       example: "Kháng sinh"
 *     responses:
 *       201:
 *         description: Tạo hồ sơ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.post('/', authenticateToken, authorizeRoles('guardian', 'nurse'), createMedicalRecord)

/**
 * @swagger
 * /api/v1/medical-records/{id}:
 *   put:
 *     summary: Cập nhật hồ sơ y tế
 *     tags: [MedicalRecord]
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
 *               bloodType:
 *                 type: string
 *                 example: "O+"
 *               height:
 *                 type: number
 *                 example: 130
 *               weight:
 *                 type: number
 *                 example: 35
 *               vaccines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "BCG"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2018-06-01"
 *                     status:
 *                       type: string
 *                       example: "Đã tiêm"
 *               chronicDiseases:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Tiểu đường"
 *               allergies:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Phấn hoa"
 *               pastIllnesses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     disease:
 *                       type: string
 *                       example: "Viêm họng"
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: "2021-05-20"
 *                     treatment:
 *                       type: string
 *                       example: "Uống thuốc"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 */

router.put('/:id', authenticateToken, authorizeRoles('guardian', 'nurse'), updateMedicalRecord)

/**
 * @swagger
 * /api/v1/medical-records/{id}:
 *   delete:
 *     summary: Xóa hồ sơ y tế
 *     tags: [MedicalRecord]
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
 *       404:
 *         description: Không tìm thấy
 */
router.delete('/:id', authenticateToken, authorizeRoles('guardian', 'nurse'), deleteMedicalRecord)

export default router
