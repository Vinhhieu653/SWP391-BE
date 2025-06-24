import express from 'express'
import {
  getAllMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  deleteMedicalRecord,
  getMedicalRecordsByGuardian,
  createStudentAndMedical,
  updateStudentAndMedical
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
 * /api/v1/medical-records/by-guardian:
 *   get:
 *     summary: Lấy danh sách hồ sơ y tế của các học sinh mà guardian này giám hộ
 *     tags: [MedicalRecord]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách hồ sơ y tế của con
 *       401:
 *         description: Không xác thực
 */
router.get('/by-guardian', authenticateToken, authorizeRoles('guardian'), getMedicalRecordsByGuardian)

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
router.delete('/:id', authenticateToken, authorizeRoles('guardian'), deleteMedicalRecord)

/**
 * @swagger
 * /api/v1/medical-records/student:
 *   post:
 *     summary: Tạo học sinh mới và hồ sơ y tế, đồng thời gán vào guardian hiện tại
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
 *               - guardianUserId
 *               - student
 *               - medicalRecord
 *             properties:
 *               guardianUserId:
 *                 type: integer
 *                 example: 1
 *               student:
 *                 type: object
 *                 required:
 *                   - fullname
 *                   - dateOfBirth
 *                   - gender
 *                 properties:
 *                   fullname:
 *                     type: string
 *                     example: "Nguyễn Văn A"
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: "2014-09-15"
 *                   gender:
 *                     type: string
 *                     example: "Nam"
 *               medicalRecord:
 *                 type: object
 *                 required:
 *                   - class
 *                   - height
 *                   - weight
 *                   - bloodType
 *                 properties:
 *                   class:
 *                     type: string
 *                     example: "4A"
 *                   height:
 *                     type: number
 *                     example: 130
 *                   weight:
 *                     type: number
 *                     example: 28
 *                   bloodType:
 *                     type: string
 *                     example: "O"
 *                   chronicDiseases:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Hen suyễn"
 *                   allergies:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Phấn hoa"
 *                   pastIllnesses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         disease:
 *                           type: string
 *                           example: "Sốt xuất huyết"
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: "2023-05-01"
 *                         treatment:
 *                           type: string
 *                           example: "Nghỉ ngơi + truyền dịch"
 *     responses:
 *       201:
 *         description: Tạo học sinh và hồ sơ y tế thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/student', authenticateToken, authorizeRoles('guardian'), createStudentAndMedical)

/**
 * @swagger
 * /api/v1/medical-records/student:
 *   put:
 *     summary: Cập nhật học sinh và hồ sơ y tế, xác thực bởi guardian
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
 *               - guardianUserId
 *               - student
 *               - medicalRecord
 *             properties:
 *               guardianUserId:
 *                 type: integer
 *                 example: 6
 *               student:
 *                 type: object
 *                 properties:
 *                   fullname:
 *                     type: string
 *                     example: "Nguyễn Văn B"
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                     example: "2013-05-10"
 *                   gender:
 *                     type: string
 *                     example: "Nam"
 *               medicalRecord:
 *                 type: object
 *                 properties:
 *                   class:
 *                     type: string
 *                     example: "5B"
 *                   height:
 *                     type: number
 *                     example: 135
 *                   weight:
 *                     type: number
 *                     example: 30
 *                   bloodType:
 *                     type: string
 *                     example: "B+"
 *                   chronicDiseases:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Hen suyễn"
 *                   allergies:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "Trứng"
 *                   pastIllnesses:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         disease:
 *                           type: string
 *                           example: "Viêm phế quản"
 *                         date:
 *                           type: string
 *                           format: date
 *                           example: "2022-11-01"
 *                         treatment:
 *                           type: string
 *                           example: "Kháng sinh"
 *     responses:
 *       200:
 *         description: Cập nhật học sinh và hồ sơ y tế thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy hồ sơ hoặc học sinh
 */
router.put('/student/:id', authenticateToken, authorizeRoles('guardian'), updateStudentAndMedical)

export default router
