import express from 'express'
import {
  createOtherMedical,
  getAllOtherMedical,
  getOtherMedicalById,
  updateOtherMedical,
  deleteOtherMedical
} from '../../controllers/other_medical/Other_medical.controller.js'
import { authenticateToken, authorizeRoles } from '../../middlewares/auth.middleware.js'
import multer from 'multer'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })

/**
 * @swagger
 * /api/v1/other-medical:
 *   post:
 *     summary: Create a new other medical record
 *     tags: [OtherMedical]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               MR_ID:
 *                 type: string
 *               Decription:
 *                 type: string
 *               Image:
 *                 type: string
 *                 format: binary
 *               Handle:
 *                type: string
 *               Is_calLOb:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Other medical record created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, authorizeRoles('nurse', 'admin'), upload.single('Image'), createOtherMedical)

/**
 * @swagger
 * /api/v1/other-medical:
 *   get:
 *     summary: Get all other medical records
 *     tags: [OtherMedical]
 *     responses:
 *       200:
 *         description: List of other medical records
 */
router.get('/', getAllOtherMedical)

/**
 * @swagger
 * /api/v1/other-medical/{id}:
 *   get:
 *     summary: Get an other medical record by ID
 *     tags: [OtherMedical]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Other medical record ID
 *     responses:
 *       200:
 *         description: Other medical record data
 *       404:
 *         description: Not found
 */
router.get('/:id', getOtherMedicalById)

/**
 * @swagger
 * /api/v1/other-medical/{id}:
 *   put:
 *     summary: Update an other medical record by ID
 *     tags: [OtherMedical]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Other medical record ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               MR_ID:
 *                 type: string
 *               Handle:
 *                type: string
 *               Decription:
 *                 type: string
 *               Image:
 *                 type: string
 *                 format: binary
 *               Is_calLOb:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Other medical record updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, authorizeRoles('nurse', 'admin'), upload.single('Image'), updateOtherMedical)

/**
 * @swagger
 * /api/v1/other-medical/{id}:
 *   delete:
 *     summary: Delete an other medical record by ID
 *     tags: [OtherMedical]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Other medical record ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticateToken, authorizeRoles('nurse', 'admin'), deleteOtherMedical)

export default router
