import express from 'express'
import {
  createGuardianWithStudents,
  getAllGuardians,
  getGuardianById,
  updateGuardian,
  deleteGuardian,
  getStudentsByUserId
} from '../../controllers/guardian/guardian.controller.js'

import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Guardian
 *   description: API quản lý phụ huynh và học sinh
 */

/**
 * @swagger
 * /api/v1/guardians:
 *   post:
 *     summary: Tạo phụ huynh kèm danh sách học sinh (lồng trong guardian)
 *     tags: [Guardian]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guardian
 *             properties:
 *               guardian:
 *                 type: object
 *                 required:
 *                   - fullname
 *                   - username
 *                   - email
 *                   - password
 *                   - phoneNumber
 *                   - roleInFamily
 *                   - isCallFirst
 *                   - students
 *                 properties:
 *                   fullname:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   roleInFamily:
 *                     type: string
 *                   isCallFirst:
 *                     type: boolean
 *                   students:
 *                     type: array
 *                     items:
 *                       type: object
 *                       required:
 *                         - fullname
 *                         - username
 *                         - email
 *                         - password
 *                       properties:
 *                         fullname:
 *                           type: string
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         password:
 *                           type: string
 *                         phoneNumber:
 *                           type: string
 *     responses:
 *       201:
 *         description: Tạo phụ huynh và học sinh thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không xác thực
 *       500:
 *         description: Lỗi server
 */


router.post('/', authenticateToken, authorizeRoles('admin'), createGuardianWithStudents)

/**
 * @swagger
 * /api/v1/guardians:
 *   get:
 *     summary: Lấy danh sách phụ huynh
 *     tags: [Guardian]
 *     responses:
 *       200:
 *         description: Danh sách phụ huynh
 */
router.get('/', getAllGuardians)

/**
 * @swagger
 * /api/v1/guardians/{id}:
 *   get:
 *     summary: Lấy thông tin phụ huynh theo ID
 *     tags: [Guardian]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin phụ huynh
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:id', getGuardianById)

/**
 * @swagger
 * /api/v1/guardians/{id}:
 *   put:
 *     summary: Cập nhật thông tin phụ huynh
 *     tags: [Guardian]
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
 *               phone_number:
 *                 type: string
 *               role_in_family:
 *                 type: string
 *               is_call_first:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy
 */
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateGuardian)

/**
 * @swagger
 * /api/v1/guardians/{id}:
 *   delete:
 *     summary: Xoá phụ huynh
 *     tags: [Guardian]
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
 *         description: Xoá thành công
 *       404:
 *         description: Không tìm thấy
 */
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteGuardian)

/**
 * @swagger
 * /api/v1/guardians/{userId}/students:
 *   get:
 *     summary: Lấy danh sách học sinh theo userId của phụ huynh
 *     tags: [Guardian]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách học sinh
 *       404:
 *         description: Không tìm thấy
 */
router.get('/:userId/students', getStudentsByUserId)


export default router
