import express from 'express'
import {
  getAllMedicalSents,
    getMedicalSentById,
    createMedicalSent,
    updateMedicalSent,
    deleteMedicalSent,
  getMedicalSentsByGuardian
} from '../../controllers/medical-sent/medical-sent.controller.js';
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js';
import multer from 'multer'

const router = express.Router();
const upload = multer({ dest: 'uploads/' })

/**
 * @swagger
 * tags:
 *   name: MedicalSent
 *   description: API quản lý đơn thuốc đã gửi
 */


/**
 * @swagger
 * /api/v1/medical-sents/by-guardian:
 *   get:
 *     summary: Lấy danh sách toa thuốc của các học sinh mà guardian này giám hộ
 *     tags: [MedicalSent]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách toa thuốc của con
 *       401:
 *         description: Không xác thực
 */
router.get('/by-guardian', authenticateToken, authorizeRoles('guardian'), getMedicalSentsByGuardian);

/**
 * @swagger
 * /api/v1/medical-sents:
 *   get:
 *     summary: Lấy tất cả đơn thuốc đã gửi
 *     tags: [MedicalSent]
 *     responses:
 *       200:
 *         description: Danh sách đơn thuốc
 */
router.get('/', getAllMedicalSents)

/**
 * @swagger
 * /api/v1/medical-sents/{id}:
 *   get:
 *     summary: Lấy đơn thuốc đã gửi theo ID
 *     tags: [MedicalSent]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin đơn thuốc
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', getMedicalSentById)


/**
 * @swagger
 * /api/v1/medical-sents:
 *   post:
 *     summary: Tạo mới đơn thuốc gửi đi
 *     tags: [MedicalSent]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - prescriptionImage
 *               - medications
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 3
 *               guardianPhone:
 *                 type: string
 *                 example: "0901234567"
 *               class:
 *                 type: string
 *                 example: "4A3"
 *               prescriptionImage:
 *                 type: string
 *                 format: binary
 *               medications:
 *                 type: string
 *                 example: "Paracetamol 500mg x2 viên, Amoxicillin 250mg x3 viên"
 *               deliveryTime:
 *                 type: string
 *                 example: "14:30"
 *               status:
 *                 type: string
 *                 example: "delivered"
 *               notes:
 *                 type: string
 *                 example: "Giao hàng thành công"
 *     responses:
 *       201:
 *         description: Tạo đơn thuốc thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

router.post('/', authenticateToken, authorizeRoles('guardian', 'nurse'), upload.single('prescriptionImage'), createMedicalSent)

/**
 * @swagger
 * /api/v1/medical-sents/{id}:
 *   put:
 *     summary: Cập nhật đơn thuốc đã gửi
 *     tags: [MedicalSent]
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
 *               userId:
 *                 type: integer
 *                 example: 3
 *               Guardian_phone:
 *                 type: string
 *                 example: "0901234567"
 *               class:
 *                 type: string
 *                 example: "4A3"
 *               prescriptionImage:
 *                 type: string
 *                 format: binary
 *               medications:
 *                 type: string
 *                 example: "Paracetamol 500mg x2 viên, Amoxicillin 250mg x3 viên"
 *               deliveryTime:
 *                 type: string
 *                 example: "14:30"
 *               status:
 *                 type: string
 *                 example: "delivered"
 *               notes:
 *                 type: string
 *                 example: "Giao hàng thành công"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 */

router.put('/:id', authenticateToken, authorizeRoles('guardian', 'nurse') , upload.single('prescriptionImage'), updateMedicalSent)

/**
 * @swagger
 * /api/v1/medical-sents/{id}:
 *   delete:
 *     summary: Xóa đơn thuốc đã gửi
 *     tags: [MedicalSent]
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
router.delete('/:id', authenticateToken, authorizeRoles('guardian', 'nurse'), deleteMedicalSent)

export default router
