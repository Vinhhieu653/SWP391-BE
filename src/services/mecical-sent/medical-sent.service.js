import MedicalSent from '../../models/data/medical_sent.model.js'
import OutpatientMedication from '../../models/data/outpatient_medication.model.js'
import MedicalRecord from '../../models/data/medicalRecord.model.js'
import GuardianUser from '../../models/data/guardian_user.model.js'
import User from '../../models/data/user.model.js'
import Guardian from '../../models/data/guardian.model.js'
import Notification from '../../models/data/noti.model.js'

// Tạo mới MedicalSent và liên kết OutpatientMedication
export const createMedicalSentService = async (data, creator_by = 'system') => {
  const {
    userId,
    guardianPhone,
    Class: studentClass,
    prescriptionImage,
    medications,
    deliveryTime,
    status,
    notes
  } = data

  if (!userId) throw { status: 400, message: 'userId is required' }

  // 1. Tìm MedicalRecord theo userId
  const medicalRecord = await MedicalRecord.findOne({ where: { userId: userId } })
  if (!medicalRecord) throw { status: 404, message: 'Medical record not found for this user' }

  const ID = medicalRecord.ID

  // 2. Tìm hoặc tạo OutpatientMedication theo ID
  let outpatient = await OutpatientMedication.findOne({ where: { ID: ID } })
  if (!outpatient) {
    outpatient = await OutpatientMedication.create({ ID: ID })
  }

  // 3. Tạo bản ghi MedicalSent
  const medicalSent = await MedicalSent.create({
    User_ID: userId,
    Guardian_phone: guardianPhone,
    Class: studentClass,
    Image_prescription: prescriptionImage,
    Medications: medications,
    Delivery_time: deliveryTime,
    Status: status,
    Notes: notes,
    Created_at: new Date()
  })

  // 4. Gửi thông báo cho tất cả nurse
  const nurseUsers = await User.findAll({
    where: { roleId: 2 } // thay 2 bằng roleId thực tế của nurse nếu khác
  })

  await Promise.all(
    nurseUsers.map(async (nurse) => {
      await Notification.create({
        title: 'Có đơn thuốc mới từ phụ huynh',
        mess: `Vui lòng kiểm tra đơn thuốc vừa được gửi để xử lý.`,
        userId: nurse.id
      })
    })
  )

  const { Form_ID, Outpatient_medication, OM_ID, ...cleaned } = medicalSent.get({ plain: true })
  return cleaned
}

// Lấy toàn bộ MedicalSent
export const getAllMedicalSentService = async () => {
  const records = await MedicalSent.findAll({
    include: [
      {
        model: OutpatientMedication,
        include: [MedicalRecord]
      }
    ]
  })

  return records.map((record) => {
    const { Form_ID, Outpatient_medication, OM_ID, ...rest } = record.get({ plain: true })
    return rest
  })
}

// Lấy 1 bản ghi MedicalSent theo ID
export const getMedicalSentByIdService = async (id) => {
  const record = await MedicalSent.findByPk(id, {
    include: [
      {
        model: OutpatientMedication,
        include: [MedicalRecord]
      }
    ]
  })

  if (!record) throw { status: 404, message: 'Medical sent record not found' }

  const { Form_ID, Outpatient_medication, OM_ID, ...cleaned } = record.get({ plain: true })
  return cleaned
}

// Cập nhật MedicalSent
export const updateMedicalSentService = async (id, updateData) => {
  const record = await MedicalSent.findByPk(id)
  if (!record) throw { status: 404, message: 'Medical sent record not found' }

  await record.update(updateData)
  const { Form_ID, Outpatient_medication, OM_ID, ...cleaned } = record.get({ plain: true })
  return cleaned
}

// Xóa MedicalSent
export const deleteMedicalSentService = async (id) => {
  const record = await MedicalSent.findByPk(id)
  if (!record) throw { status: 404, message: 'Medical sent record not found' }

  await record.destroy()
  return { message: 'Deleted successfully' }
}

export const getMedicalSentsByGuardianUserIdService = async (guardianUserId) => {
  // B1: Lấy dòng Guardian theo ID
  const guardianLink = await Guardian.findOne({ where: { userId: guardianUserId } })
  if (!guardianLink) throw { status: 404, message: 'Không tìm thấy liên kết phụ huynh-học sinh' }

  const obId = guardianLink.obId

  // B2: Tìm tất cả học sinh (userId) có chung obId này
  const relatedGuardianUsers = await GuardianUser.findAll({
    where: { obId }
  })

  const studentUserIds = relatedGuardianUsers.map((g) => g.userId)

  console.log('studentUserIds:', studentUserIds)

  if (studentUserIds.length === 0) return []

  // B3: Lấy các đơn thuốc (MedicalSent) của các học sinh đó
  const medicalSents = await MedicalSent.findAll({
    where: {
      User_ID: studentUserIds
    }
  })

  return medicalSents
}
