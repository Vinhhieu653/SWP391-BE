import * as medicalRecordService from '../../services/medical-record/medical-record.service.js'

// Lấy tất cả hồ sơ y tế
export const getAllMedicalRecords = async (req, res) => {
  try {
    const records = await medicalRecordService.getAllMedicalRecords()
    res.status(200).json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Lấy hồ sơ y tế theo ID
export const getMedicalRecordById = async (req, res) => {
  try {
    const record = await medicalRecordService.getMedicalRecordById(req.params.id)
    if (!record) return res.status(404).json({ message: 'Hồ sơ không tồn tại' })
    res.status(200).json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Tạo mới hồ sơ y tế
export const createMedicalRecord = async (req, res) => {
  try {
    const newRecord = await medicalRecordService.createMedicalRecord(req.body)
    res.status(201).json(newRecord)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Cập nhật hồ sơ y tế
export const updateMedicalRecord = async (req, res) => {
  try {
    const updatedRecord = await medicalRecordService.updateMedicalRecord(req.params.id, req.body)
    if (!updatedRecord) return res.status(404).json({ message: 'Hồ sơ không tồn tại' })
    res.status(200).json(updatedRecord)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Xóa hồ sơ y tế
export const deleteMedicalRecord = async (req, res) => {
  try {
    const deleted = await medicalRecordService.deleteMedicalRecord(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Hồ sơ không tồn tại' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Lấy các hồ sơ y tế của học sinh do 1 guardian quản lý
export const getMedicalRecordsByGuardian = async (req, res) => {
  try {
    const guardianUserId = req.user?.userId;
    if (!guardianUserId) return res.status(401).json({ message: 'Unauthorized' });

    const records = await medicalRecordService.getMedicalRecordsByGuardianUserIdService(guardianUserId);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
