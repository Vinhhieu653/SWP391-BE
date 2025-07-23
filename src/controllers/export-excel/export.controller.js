import { exportToExcel } from '../../services/export-excel/export.service.js'
import { getStudentsByEventIdService } from '../../services/Vaccine/Vaccine.service.js'
import { getStudentsByEvent } from '../../services/health-check/health-check.service.js'

export const handleExportExcel = async (req, res) => {
  const { type, eventId } = req.query

  // 1. Validate đầu vào
  if (!type || !eventId || !['vaccine', 'health'].includes(type)) {
    return res.status(400).json({ message: 'Thiếu hoặc không hợp lệ: type phải là vaccine|health và có eventId' })
  }

  try {
    let rawData, sheetName, flatData

    if (type === 'vaccine') {
      // 2a. Lấy raw data từ service vaccine
      rawData = await getStudentsByEventIdService(Number(eventId))
      // Kiểm tra định dạng trả về
      if (!rawData?.students) {
        return res.status(404).json({ message: 'Không tìm thấy bản ghi vaccine nào' })
      }
      sheetName = `Tiêm-chủng-${eventId}`

      flatData = rawData.students.map((st, idx) => ({
        STT: idx + 1,
        'Mã HS': st.studentId,
        'Họ tên': st.fullname,
        'Lớp': st.Class,
        'Vaccine': st.vaccineHistory.vaccine_name,
        'Loại': st.vaccineHistory.vaccine_type,
        'Ngày tiêm': st.vaccineHistory.date_injection
          ? new Date(st.vaccineHistory.date_injection).toISOString().split('T')[0]
          : '',
        'Số lô': st.vaccineHistory.batch_number ?? ''
      }))

    }
    else { // type === 'health'
      // 2b. Lấy raw data từ service health
      rawData = await getStudentsByEvent(Number(eventId))
      // rawData ở đây là Array — kiểm tra ít nhất 1 phần tử
      if (!Array.isArray(rawData) || rawData.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy bản ghi sức khỏe nào' })
      }
      sheetName = `Khám-sức-khỏe-${eventId}`

      flatData = rawData.map((form, idx) => ({
        STT: idx + 1,
        'Form ID': form.Form_ID,
        'Mã HS': form.Student?.id ?? '',
        'Họ tên': form.Student?.fullname ?? '',
        'Lớp': form.Student?.Class ?? '',
        'Chiều cao': form.Height ?? '',
        'Cân nặng': form.Weight ?? '',
        'Huyết áp': form.Blood_Pressure ?? '',
        'Thị lực trái': form.Vision_Left ?? '',
        'Thị lực phải': form.Vision_Right ?? '',
        'Kết quả tổng quát': form.General_Conclusion ?? '',
        'Cần gặp': form.Is_need_meet ? 'Có' : 'Không',
        'Trạng thái': form.status,
        'Ngày khám': form.createdAt
          ? new Date(form.createdAt).toISOString().split('T')[0]
          : '',
      }))

    }

    // 3. Nếu flatData rỗng, vẫn tạo sheet có header
    if (flatData.length === 0) {
      // tao header tu keys (nếu data empty thi phai define header tay)
      flatData = [{}]
    }

    // 4. Xuất Excel
    const buffer = await exportToExcel(flatData, sheetName)

    // trước khi send buffer
    const rawName = `${sheetName}.xlsx`

    // 1) Nếu bạn không cần dấu, dùng phương án normalize + replace
    const safeName = rawName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\.]/g, '_')

    // 2) Hoặc nếu muốn giữ dấu, dùng encodeURIComponent
    const encodedName = encodeURIComponent(rawName)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    // Chọn 1 trong 2:
    // res.setHeader('Content-Disposition',
    //   `attachment; filename="${safeName}"`
    // );
    // hoặc
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedName}`)

    res.send(buffer)
  } catch (err) {
    console.error(err)
    // **Chuyển content-type về JSON** để Swagger và Postman hiển thị
    return res.status(500).type('application/json').json({ message: 'Export failed', error: err.message })
  }
}
