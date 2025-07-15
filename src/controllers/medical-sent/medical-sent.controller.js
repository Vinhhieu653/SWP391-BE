import * as medicalSentService from '../../services/mecical-sent/medical-sent.service.js'
import cloudinary from '../../utils/cloudinary.js'

export const getAllMedicalSents = async (req, res) => {
  try {
    const records = await medicalSentService.getAllMedicalSentService()
    res.status(200).json(records)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMedicalSentById = async (req, res) => {
  try {
    const record = await medicalSentService.getMedicalSentByIdService(req.params.id)
    if (!record) return res.status(404).json({ message: 'Đơn thuốc không tồn tại' })
    res.status(200).json(record)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createMedicalSent = async (req, res) => {
  try {
    let imageUrl = null
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      imageUrl = result.secure_url
    }

    const formData = {
      ...req.body,
      prescriptionImage: imageUrl
    }

    const newRecord = await medicalSentService.createMedicalSentService(formData)

    res.status(201).json(newRecord)
  } catch (error) {
    res.status(error.status || 400).json({
      status: error.status || 400,
      message: error.message || 'Lỗi tạo đơn thuốc'
    })
  }
}

export const updateMedicalSent = async (req, res) => {
  try {
    let imageUrl = null

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      imageUrl = result.secure_url
    }

    const formData = {
      ...req.body,
      prescriptionImage: imageUrl
    }

    if (imageUrl) {
      formData.prescriptionImage = imageUrl
    }

    const updated = await medicalSentService.updateMedicalSentService(req.params.id, formData)

    if (!updated) {
      return res.status(404).json({ message: 'Đơn thuốc không tồn tại' })
    }

    res.status(200).json(updated)
  } catch (error) {
    res.status(error.status || 400).json({
      status: error.status || 400,
      message: error.message || 'Lỗi cập nhật đơn thuốc'
    })
  }
}

export const deleteMedicalSent = async (req, res) => {
  try {
    const deleted = await medicalSentService.deleteMedicalSentService(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Đơn thuốc không tồn tại' })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getMedicalSentsByGuardian = async (req, res, next) => {
  try {
    console.log('res.user:', req.user)
    const guardianUserId = req.user?.userId

    if (!guardianUserId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const results = await medicalSentService.getMedicalSentsByGuardianUserIdService(guardianUserId)
    res.status(200).json(results)
  } catch (error) {
    next(error)
  }
}
