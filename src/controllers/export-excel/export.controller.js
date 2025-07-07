// src/controllers/export.controller.js
import { exportToExcel } from '../../services/export-excel/export.service.js'
import { getDataForExport } from '../../services/export-excel/getDataForExport.js'

export const handleExportExcel = async (req, res) => {
  try {
    const data = await getDataForExport()

    const buffer = await exportToExcel(data, 'Danh sách')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx')

    res.send(buffer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Export failed' })
  }
}
