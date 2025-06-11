import Medical_record from '../../models//data/medicalRecord.model.js'

export const getMedicalRecordByIdService = async (id) => {
  const record = await Medical_record.findByPk(id)
  if (!record) throw { status: 404, message: 'Medical record not found' }
  return record
}

export const getAllMedicalRecordsService = async () => {
  return await Medical_record.findAll()
}

export const createMedicalRecordService = async (data) => {
  return await Medical_record.create(data)
}

export const updateMedicalRecordService = async (id, data) => {
  const record = await Medical_record.findByPk(id)
  if (!record) throw { status: 404, message: 'Medical record not found' }
  await record.update(data)
  return record
}

// Xóa medical record
export const deleteMedicalRecordService = async (id) => {
  const record = await Medical_record.findByPk(id)
  if (!record) throw { status: 404, message: 'Medical record not found' }
  await record.destroy()
}
