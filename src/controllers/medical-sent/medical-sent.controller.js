import * as medicalSentService from '../../services/mecical-sent/medical-sent.service.js'

// Lấy tất cả đơn thuốc đã gửi
export const getAllMedicalSents = async (req, res) => {
  try {
    const records = await medicalSentService.getAllMedicalSentService()
    res.status(200).json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Lấy đơn thuốc đã gửi theo ID
export const getMedicalSentById = async (req, res) => {
  try {
    const record = await medicalSentService.getMedicalSentByIdService(req.params.id)
    if (!record) return res.status(404).json({ message: 'Đơn thuốc không tồn tại' })
    res.status(200).json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Tạo mới đơn thuốc đã gửi
export const createMedicalSent = async (req, res) => {
  try {
    const newRecord = await medicalSentService.createMedicalSentService(req.body)
    res.status(201).json(newRecord)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Cập nhật đơn thuốc đã gửi
export const updateMedicalSent = async (req, res) => {
  try {
    const updated = await medicalSentService.updateMedicalSentService(req.params.id, req.body)
    if (!updated) return res.status(404).json({ message: 'Đơn thuốc không tồn tại' })
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Xóa đơn thuốc đã gửi
export const deleteMedicalSent = async (req, res) => {
  try {
    const deleted = await medicalSentService.deleteMedicalSentService(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Đơn thuốc không tồn tại' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
