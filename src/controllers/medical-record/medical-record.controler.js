import * as medicalRecordService from '../../services/medical-record/medical-record.service.js'

export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await medicalRecordService.getAllMedicalRecords()
    res.status(200).json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await medicalRecordService.getMedicalRecordById(req.params.id)
    if (!record) return res.status(404).json({ message: 'Hồ sơ không tồn tại' })
    res.status(200).json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateMedicalRecord = async (req, res) => {
  try {
    const updatedRecord = await medicalRecordService.updateMedicalRecord(req.params.id, req.body)
    if (!updatedRecord) return res.status(404).json({ message: 'Hồ sơ không tồn tại' })
    res.status(200).json(updatedRecord)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deleteMedicalRecord = async (req, res) => {
  try {
    const deleted = await medicalRecordService.deleteMedicalRecord(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Hồ sơ không tồn tại' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMedicalRecordsByGuardian = async (req, res) => {
  try {
    const guardianUserId = req.user?.userId
    if (!guardianUserId) return res.status(401).json({ message: 'Unauthorized' })

    const records = await medicalRecordService.getMedicalRecordsByGuardianUserIdService(guardianUserId)
    res.status(200).json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createStudentAndMedical = async (req, res, next) => {
  try {
    const { guardianUserId, student, medicalRecord } = req.body

    const result = await medicalRecordService.createStudentWithMedicalRecord({
      guardianUserId,
      student,
      medicalRecord
    })

    return res.status(201).json(result)
  } catch (error) {
    console.error('Error creating student & medical record:', error.message)
    return res.status(error.status || 500).json({
      message: error.message || 'Internal Server Error'
    })
  }
}

export const updateStudentAndMedical = async (req, res) => {
  try {
    const medicalRecordId = parseInt(req.params.id, 10)

    const { guardianUserId, student, medicalRecord } = req.body

    const result = await medicalRecordService.updateStudentWithMedicalRecord({
      guardianUserId,
      medicalRecordId,
      student,
      medicalRecord
    })

    return res.status(200).json(result)
  } catch (error) {
    console.error('Error updating student & medical record:', error.message)
    return res.status(error.status || 500).json({
      message: error.message || 'Internal Server Error'
    })
  }
}
