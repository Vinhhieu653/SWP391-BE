import MedicalRecord from '../../models/data/medicalRecord.model.js'

// Lấy tất cả hồ sơ y tế
export const getAllMedicalRecords = async () => {
  return await MedicalRecord.findAll()
}

// Lấy hồ sơ y tế theo ID
export const getMedicalRecordById = async (id) => {
  return await MedicalRecord.findByPk(id)
}

// Tạo mới hồ sơ y tế
export const createMedicalRecord = async (data) => {
  return await MedicalRecord.create(data)
}

// Cập nhật hồ sơ y tế
export const updateMedicalRecord = async (id, data) => {
  const record = await MedicalRecord.findByPk(id)
  if (!record) return null
  return await record.update(data)
}

// Xóa hồ sơ y tế
export const deleteMedicalRecord = async (id) => {
  const record = await MedicalRecord.findByPk(id)
  if (!record) return null
  await record.destroy()
  return true
}
