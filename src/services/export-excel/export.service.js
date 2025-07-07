// src/services/export.service.js
import ExcelJS from 'exceljs'

export const exportToExcel = async (data, sheetName = 'Sheet1') => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  // Thêm header
  const headers = Object.keys(data[0])
  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: 20
  }))

  // Thêm dữ liệu
  data.forEach((item) => {
    worksheet.addRow(item)
  })

  // Trả buffer về để stream xuống client
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}
