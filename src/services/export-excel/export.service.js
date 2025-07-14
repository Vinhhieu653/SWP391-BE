import ExcelJS from 'exceljs'

export const exportToExcel = async (data, sheetName = 'Sheet1') => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)

  const headers = Object.keys(data[0])
  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: 20
  }))

  data.forEach((item) => {
    worksheet.addRow(item)
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}
