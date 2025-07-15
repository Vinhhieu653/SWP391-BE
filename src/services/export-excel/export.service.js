import ExcelJS from 'exceljs'

export const exportToExcel = async (data, sheetName = 'Sheet1') => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  // 1. Xác định header từ keys của phần tử đầu tiên
  const headers = Object.keys(data[0])
  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: 20
  }))

  // 2. Ghi từng dòng
  data.forEach((row) => {
    worksheet.addRow(row)
  })

  // 3. Xuống buffer
  return await workbook.xlsx.writeBuffer()
}
