import MedicalRecord from '../../models/data/medicalRecord.model.js'
import User from '../../models/data/user.model.js'
import Guardian from '../../models/data/guardian.model.js'
import GuardianUser from '../../models/data/guardian_user.model.js'

export const getAllMedicalRecords = async () => {
  const records = await MedicalRecord.findAll({
    include: {
      model: User,
      attributes: ['fullname']
    }
  })

  // Trả về fullName nằm ngoài cùng
  return records.map((record) => {
    const plain = record.get({ plain: true }) // bỏ các phương thức sequelize
    const fullname = plain.User?.fullname || null
    delete plain.User // xoá key User

    return {
      ...plain,
      fullname
    }
  })
}

// Lấy hồ sơ y tế theo ID
export const getMedicalRecordById = async (id) => {
  const record = await MedicalRecord.findByPk(id, {
    include: {
      model: User,
      attributes: ['fullname']
    }
  })

  if (!record) return null

  const plain = record.get({ plain: true })
  const fullname = plain.User?.fullname || null
  delete plain.User

  return {
    ...plain,
    fullname
  }
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

// Lấy danh sách MedicalRecord học sinh theo userId phụ huynh
export const getMedicalRecordsByGuardianUserIdService = async (guardianUserId) => {
  // B1: Tìm Guardian theo userId
  const guardianLink = await Guardian.findOne({ where: { userId: guardianUserId } })
  if (!guardianLink) throw { status: 404, message: 'Không tìm thấy liên kết phụ huynh-học sinh' }

  const obId = guardianLink.obId

  // B2: Lấy tất cả userId học sinh thuộc cùng obId
  const relatedGuardianUsers = await GuardianUser.findAll({ where: { obId } })

  const studentUserIds = relatedGuardianUsers.map((g) => g.userId)
  if (studentUserIds.length === 0) return []

  // B3: Lấy MedicalRecord của các học sinh đó
  const records = await MedicalRecord.findAll({
    where: {
      userId: studentUserIds
    },
    include: {
      model: User,
      attributes: ['fullname']
    }
  })

  // Trả về fullname ở ngoài object
  return records.map((record) => {
    const plain = record.get({ plain: true })
    const fullname = plain.User?.fullname || null
    delete plain.User

    return {
      ...plain,
      fullname
    }
  })
}
