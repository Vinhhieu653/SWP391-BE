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
    const error = new Error('Missing guardian or student/medical data');
    error.status = 400;
    throw error;
  }

  // Đăng ký user học sinh cơ bản (chỉ cần fullname, dateOfBirth, gender)
  const studentUser = await User.create({
    fullname: student.fullname,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    roleId: 3
  });

  // Tạo hồ sơ y tế, gán với userId vừa tạo
  const medicalRecordCreated = await MedicalRecord.create({
    ...medicalRecord,
    userId: studentUser.id,
    fullName: student.fullname,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender
  });

  console.log('Medical record created:', guardianUserId);
  // Tìm guardian theo userId
  const guardian = await Guardian.findOne({ where: { userId: guardianUserId } });
  if (!guardian) throw Object.assign(new Error('Guardian not found'), { status: 404 });

  // Gán học sinh vào guardian
  await GuardianUser.create({
    obId: guardian.obId,
    userId: studentUser.id
  });

  return {
    message: 'Student and medical record created successfully',
    data: {
      student: studentUser,
      medicalRecord: medicalRecordCreated
    }
  };
};

export const updateStudentWithMedicalRecord = async ({
  guardianUserId,
  medicalRecordId,
  student,
  medicalRecord
}) => {
  if (!guardianUserId || !medicalRecordId || !student || !medicalRecord) {
    const error = new Error('Missing required data for update');
    error.status = 400;
    throw error;
  }

  // Tìm hồ sơ y tế
  const medicalRecordInstance = await MedicalRecord.findByPk(medicalRecordId);
  if (!medicalRecordInstance) {
    throw Object.assign(new Error('Medical record not found'), { status: 404 });
  }

  // Lấy userId từ hồ sơ y tế
  const studentUserId = medicalRecordInstance.userId;

  // Kiểm tra student user tồn tại
  const studentUser = await User.findByPk(studentUserId);
  if (!studentUser) {
    throw Object.assign(new Error('Student user not found'), { status: 404 });
  }

  // Kiểm tra liên kết với guardian
  const guardian = await Guardian.findOne({ where: { userId: guardianUserId } });
  if (!guardian) throw Object.assign(new Error('Guardian not found'), { status: 404 });

  const link = await GuardianUser.findOne({ where: { obId: guardian.obId, userId: studentUserId } });
  if (!link) throw Object.assign(new Error('This student does not belong to the guardian'), { status: 403 });

  // Cập nhật thông tin học sinh
  await studentUser.update({
    fullname: student.fullname || studentUser.fullname,
    dateOfBirth: student.dateOfBirth || studentUser.dateOfBirth,
    gender: student.gender || studentUser.gender
  });

  // Cập nhật thông tin hồ sơ y tế
  await medicalRecordInstance.update({
    ...medicalRecord,
    fullname: student.fullname,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender
  });

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
  };
};
