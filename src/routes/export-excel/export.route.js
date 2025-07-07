import { Router } from 'express'
import { handleExportExcel } from '../../controllers/export-excel/export.controller.js'

const router = Router()

/**
 * @swagger
 * /api/v1/export-excel:
 *   get:
 *     summary: Export danh sách ra file Excel
 *     tags: [Export]
 *     responses:
 *       200:
 *         description: File Excel được trả về thành công
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Lỗi khi export file
 */

router.get('/', handleExportExcel)

export default router
