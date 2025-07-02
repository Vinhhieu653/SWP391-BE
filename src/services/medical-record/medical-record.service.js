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
  });


  return await Promise.all(
    records.map(async (record) => {
      const plain = record.get({ plain: true });
      const fullname = plain.User?.fullname || null;
      delete plain.User; // xoá key User

      const guardianUser = await GuardianUser.findOne({ where: { userId: record.userId } });
      let guardian = null;
      if (guardianUser) {
        const guardianRecord = await Guardian.findByPk(guardianUser.obId);
        if (guardianRecord) {
          // Lấy tên phụ huynh từ bảng User với userId trong bảng Guardian
          const guardianUserInfo = await User.findByPk(guardianRecord.userId, { attributes: ['fullname'] });
          guardian = {
            ...guardianRecord.get({ plain: true }),
            fullname: guardianUserInfo ? guardianUserInfo.fullname : null
          };
        }
      }

      return {
        ...plain,
        fullname,
        guardian
      };
    })
  );
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

// Cập nhật hồ sơ y tế
export const updateMedicalRecord = async (id, data) => {
  const record = await MedicalRecord.findByPk(id)
  if (!record) return null

  const converted = {
    ...data,
    chronicDiseases: Array.isArray(data.chronicDiseases)
      ? data.chronicDiseases.map((d) => d.name).join(', ')
      : data.chronicDiseases,
    allergies: Array.isArray(data.allergies) ? data.allergies.map((a) => a.name).join(', ') : data.allergies,
    pastIllnesses: Array.isArray(data.pastIllnesses)
      ? data.pastIllnesses.map((p) => `${p.date} - ${p.disease} (${p.treatment})`).join(' | ')
      : data.pastIllnesses
  }

  return await record.update(converted)
}


export const deleteMedicalRecord = async (id) => {
  const record = await MedicalRecord.findByPk(id)
  if (!record) return null

  const studentUserId = record.userId


  await GuardianUser.destroy({
    where: { userId: studentUserId }
  })


  await User.destroy({
    where: { id: studentUserId }
  })

  await record.destroy()

  return true
}


export const getMedicalRecordsByGuardianUserIdService = async (guardianUserId) => {

  const guardianLink = await Guardian.findOne({ where: { userId: guardianUserId } })
  if (!guardianLink) throw { status: 404, message: 'Không tìm thấy liên kết phụ huynh-học sinh' }

  const obId = guardianLink.obId


  const relatedGuardianUsers = await GuardianUser.findAll({ where: { obId } })

  const studentUserIds = relatedGuardianUsers.map((g) => g.userId)
  if (studentUserIds.length === 0) return []

  const records = await MedicalRecord.findAll({
    where: {
      userId: studentUserIds
    },
    include: {
      model: User,
      attributes: ['fullname', 'dateOfBirth', 'gender']
    }
  })

  // Trả về fullname ở ngoài object
  return records.map((record) => {
    const plain = record.get({ plain: true })
    const fullname = plain.User?.fullname || null
    const dateOfBirth = plain.User?.dateOfBirth || null
    const gender = plain.User?.gender || null
    delete plain.User

    return {
      ...plain,
      fullname,
      dateOfBirth,
      gender
    }
  })
}

export const createStudentWithMedicalRecord = async ({ guardianUserId, student, medicalRecord }) => {
  if (!guardianUserId || !student || !medicalRecord) {
    const error = new Error('Missing guardian or student/medical data')
    error.status = 400
    throw error
  }
  // Đăng ký user học sinh cơ bản (chỉ cần fullname, dateOfBirth, gender)
  const studentUser = await User.create({
    fullname: student.fullname,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    Class: medicalRecord.class || null,
    roleId: 3
  })

  // Tạo hồ sơ y tế, gán với userId vừa tạo
  const medicalRecordCreated = await MedicalRecord.create({
    ...medicalRecord,
    userId: studentUser.id,
    fullName: student.fullname,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    chronicDiseases: Array.isArray(medicalRecord.chronicDiseases)
      ? medicalRecord.chronicDiseases.map((d) => d.name).join(', ')
      : medicalRecord.chronicDiseases,
    allergies: Array.isArray(medicalRecord.allergies)
      ? medicalRecord.allergies.map((a) => a.name).join(', ')
      : medicalRecord.allergies,
    pastIllnesses: Array.isArray(medicalRecord.pastIllnesses)
      ? medicalRecord.pastIllnesses.map((p) => `${p.date} - ${p.disease} (${p.treatment})`).join(' | ')
      : medicalRecord.pastIllnesses
  })

  console.log('Medical record created:', guardianUserId)
  // Tìm guardian theo userId
  const guardian = await Guardian.findOne({ where: { userId: guardianUserId } })
  if (!guardian) throw Object.assign(new Error('Guardian not found'), { status: 404 })

  // Gán học sinh vào guardian
  await GuardianUser.create({
    obId: guardian.obId,
    userId: studentUser.id
  })

  return {
    message: 'Student and medical record created successfully',
    data: {
      student: studentUser,
      medicalRecord: medicalRecordCreated
    }
  }
}

export const updateStudentWithMedicalRecord = async ({ guardianUserId, medicalRecordId, student, medicalRecord }) => {
  if (!guardianUserId || !medicalRecordId || !student || !medicalRecord) {
    const error = new Error('Missing required data for update')
    error.status = 400
    throw error
  }

  // Tìm hồ sơ y tế
  const medicalRecordInstance = await MedicalRecord.findByPk(medicalRecordId)
  if (!medicalRecordInstance) {
    throw Object.assign(new Error('Medical record not found'), { status: 404 })
  }

  // Lấy userId từ hồ sơ y tế
  const studentUserId = medicalRecordInstance.userId

  // Kiểm tra student user tồn tại
  const studentUser = await User.findByPk(studentUserId)
  if (!studentUser) {
    throw Object.assign(new Error('Student user not found'), { status: 404 })
  }

  // Kiểm tra liên kết với guardian
  const guardian = await Guardian.findOne({ where: { userId: guardianUserId } })
  if (!guardian) throw Object.assign(new Error('Guardian not found'), { status: 404 })

  const link = await GuardianUser.findOne({ where: { obId: guardian.obId, userId: studentUserId } })
  if (!link) throw Object.assign(new Error('This student does not belong to the guardian'), { status: 403 })

  // Cập nhật thông tin học sinh
  await studentUser.update({
    fullname: student.fullname || studentUser.fullname,
    dateOfBirth: student.dateOfBirth || studentUser.dateOfBirth,
    gender: student.gender || studentUser.gender
  })

  // Format dữ liệu trước khi update
  const formattedMedicalRecord = {
    fullname: student.fullname,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    Class: medicalRecord.Class,
    height: medicalRecord.height,
    weight: medicalRecord.weight,
    bloodType: medicalRecord.bloodType,

    // Convert mảng -> string
    chronicDiseases: Array.isArray(medicalRecord.chronicDiseases)
      ? medicalRecord.chronicDiseases.map((d) => d.name).join(', ')
      : medicalRecord.chronicDiseases || '',

    allergies: Array.isArray(medicalRecord.allergies)
      ? medicalRecord.allergies.map((a) => a.name).join(', ')
      : medicalRecord.allergies || '',

    // Nếu có vaccines tương tự:
    vaccines: Array.isArray(medicalRecord.vaccines)
      ? JSON.stringify(medicalRecord.vaccines)
      : medicalRecord.vaccines || '[]'
  }

  // Gọi update
  await medicalRecordInstance.update(formattedMedicalRecord)

  return {
    message: 'Student and medical record updated successfully',
    data: {
      student: {
        id: studentUser.id,
        fullname: studentUser.fullname,
        dateOfBirth: studentUser.dateOfBirth,
        gender: studentUser.gender,
        roleId: studentUser.roleId
      },
      medicalRecord: medicalRecordInstance
    }
  }
}
