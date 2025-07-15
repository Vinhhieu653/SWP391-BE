import { Router } from 'express'
import { handleExportExcel } from '../../controllers/export-excel/export.controller.js'

const router = Router()

/**
 * @swagger
 * /api/v1/export-excel:
 *   get:
 *     summary: Export danh sách học sinh ra file Excel theo loại
 *     tags: [Export]
 *     parameters:
 *       - in: query
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đợt tiêm chủng hoặc khám sức khỏe
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [vaccine, health]
 *         description: Loại danh sách cần export (vaccine hoặc health)
 *     responses:
 *       200:
 *         description: File Excel được trả về thành công
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Thiếu hoặc sai query parameters
 *       500:
 *         description: Lỗi khi export file
 */

router.get('/', handleExportExcel)

export default router
