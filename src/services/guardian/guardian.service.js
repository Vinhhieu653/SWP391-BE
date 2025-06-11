import User from '../../models/data/user.model.js'
import Guardian from '../../models/data/guardian.model.js'
import GuardianUser from '../../models/data/guardian_user.model.js'
import * as registerService from '../auth/register.service.js'

// Create guardian with associated student users
export const createGuardianWithStudents = async ({ guardian }) => {
  if (!guardian || !Array.isArray(guardian.students)) {
    const error = new Error('Missing guardian or students data')
    error.status = 400
    throw error
  }

  const { students, ...guardianData } = guardian

  // Check unique username/email
  const existingUsername = await User.findOne({ where: { username: guardianData.username } })
  if (existingUsername) throw Object.assign(new Error('Guardian username already taken'), { status: 400 })
  const existingEmail = await User.findOne({ where: { email: guardianData.email } })
  if (existingEmail) throw Object.assign(new Error('Guardian email already taken'), { status: 400 })

  // Register guardian user
  const guardianUser = await registerService.registerUser({
    fullname: guardianData.fullname,
    username: guardianData.username,
    email: guardianData.email,
    password: guardianData.password,
    phoneNumber: guardianData.phoneNumber,
    roleId: 4 // Guardian role
  })

  // Create Guardian record
  const guardianRecord = await Guardian.create({
    phoneNumber: guardianData.phoneNumber,
    roleInFamily: guardianData.roleInFamily,
    isCallFirst: guardianData.isCallFirst,
    userId: guardianUser.id
  })

  // Register students and link
  const createdStudents = []
  for (const student of students) {
    const studentUser = await registerService.registerUser({
      fullname: student.fullname,
      username: student.username,
      email: student.email,
      password: student.password,
      phoneNumber: student.phoneNumber || null,
      roleId: 3
    })

    await GuardianUser.create({
      obId: guardianRecord.obId,
      userId: studentUser.id
    })

    createdStudents.push(studentUser)
  }

  return {
    message: 'Guardian and students registered successfully',
    data: { guardian: guardianUser, students: createdStudents }
  }
}

// Get one guardian by obId including guardian info and student list
export const getGuardianById = async (obId) => {
  const guardian = await Guardian.findOne({ where: { obId } })
  if (!guardian) {
    const error = new Error('Guardian not found')
    error.status = 404
    throw error
  }

  // Guardian user info
  const guardianUser = await User.findByPk(guardian.userId, {
    attributes: ['id', 'username', 'fullname', 'email', 'phoneNumber']
  })

  // Students
  const links = await GuardianUser.findAll({ where: { obId } })
  const studentIds = links.map((l) => l.userId)
  const students = studentIds.length
    ? await User.findAll({
        where: { id: studentIds },
        attributes: ['id', 'username', 'fullname', 'email', 'phoneNumber']
      })
    : []

  return {
    ...guardian.dataValues,
    fullname: guardianUser.fullname,
    students
  }
}

// Get all guardians with their user info and associated students
export const getAllGuardians = async () => {
  const guardians = await Guardian.findAll()
  if (!guardians || !guardians.length) return []

  const guardianData = await Promise.all(
    guardians.map(async (guardian) => {
      const user = await User.findByPk(guardian.userId, {
        attributes: ['id', 'username', 'fullname', 'email', 'phoneNumber']
      })

      // Get associated students
      const links = await GuardianUser.findAll({ where: { obId: guardian.obId } })
      const studentIds = links.map((l) => l.userId)
      const students = studentIds.length
        ? await User.findAll({
            where: { id: studentIds },
            attributes: ['id', 'username', 'fullname', 'email', 'phoneNumber']
          })
        : []

      return {
        ...guardian.dataValues,
        fullname: user.fullname,
        students
      }
    })
  )

  return guardianData
}

// Update guardian record and its user info
export const updateGuardian = async (obId, data) => {
  const { fullname, username, email, phoneNumber, roleInFamily, isCallFirst } = data

  const guardian = await Guardian.findOne({ where: { obId } })
  if (!guardian) throw Object.assign(new Error('Guardian not found'), { status: 404 })

  const user = await User.findByPk(guardian.userId)
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })

  // Update username/email uniqueness
  if (username && username !== user.username) {
    const ex = await User.findOne({ where: { username } })
    if (ex) throw Object.assign(new Error('Username already taken'), { status: 400 })
    user.username = username
  }
  if (email && email !== user.email) {
    const ex = await User.findOne({ where: { email } })
    if (ex) throw Object.assign(new Error('Email already taken'), { status: 400 })
    user.email = email
  }

  // Update user fields
  user.fullname = fullname || user.fullname
  user.phoneNumber = phoneNumber || user.phoneNumber
  await user.save()

  // Update guardian-specific fields
  guardian.roleInFamily = roleInFamily || guardian.roleInFamily
  guardian.isCallFirst = isCallFirst !== undefined ? isCallFirst : guardian.isCallFirst
  guardian.phoneNumber = phoneNumber || guardian.phoneNumber
  await guardian.save()

  return {
    message: 'Guardian updated successfully',
    data: { guardian: guardian.dataValues, fullname: user.fullname }
  }
}

// Delete guardian, its links, and user record
export const deleteGuardian = async (obId) => {
  const guardian = await Guardian.findOne({ where: { obId } })
  if (!guardian) throw Object.assign(new Error('Guardian not found'), { status: 404 })

  // remove links
  await GuardianUser.destroy({ where: { obId } })
  // remove guardian record
  await guardian.destroy()
  // remove user account
  await User.destroy({ where: { id: guardian.userId } })

  return { message: 'Guardian and associated students links deleted' }
}

// Get students associated with a guardian by userId
export const getStudentsByUserId = async (userId) => {
  // Tìm guardian theo userId
  const guardian = await Guardian.findOne({ where: { userId } })
  if (!guardian) {
    const error = new Error('Guardian not found for this userId')
    error.status = 404
    throw error
  }

  // Lấy danh sách liên kết giữa guardian và học sinh
  const links = await GuardianUser.findAll({ where: { obId: guardian.obId } })
  const studentIds = links.map((link) => link.userId)

  // Truy vấn các học sinh tương ứng
  const students = studentIds.length
    ? await User.findAll({
        where: { id: studentIds },
        attributes: ['id', 'username', 'fullname', 'email', 'phoneNumber']
      })
    : []

  return {
    guardianObId: guardian.obId,
    students
  }
}

export const addStudentByGuardianId = async (obId, studentData) => {

  const guardian = await Guardian.findOne({ where: { obId } })
  if (!guardian) {
    throw Object.assign(new Error('Guardian not found'), { status: 404 })
  }

  const existingUsername = await User.findOne({ where: { username: studentData.username } })
  if (existingUsername) throw Object.assign(new Error('Student username already taken'), { status: 400 })
  const existingEmail = await User.findOne({ where: { email: studentData.email } })
  if (existingEmail) throw Object.assign(new Error('Student email already taken'), { status: 400 })


  const studentUser = await registerService.registerUser({
    fullname: studentData.fullname,
    username: studentData.username,
    email: studentData.email,
    password: studentData.password,
    phoneNumber: studentData.phoneNumber || null,
    roleId: 3 
  })

  await GuardianUser.create({
    obId: guardian.obId,
    userId: studentUser.id
  })

  return {
    message: 'Student added successfully',
    data: {
      student: {
        id: studentUser.id,
        username: studentUser.username,
        fullname: studentUser.fullname,
        email: studentUser.email,
        phoneNumber: studentUser.phoneNumber
      }
    }
  }
}

export const updateStudentByGuardianId = async (obId, studentId, studentData) => {
  const guardian = await Guardian.findOne({ where: { obId } })
  if (!guardian) {
    throw Object.assign(new Error('Guardian not found'), { status: 404 })
  }

  // Check if student belongs to guardian
  const link = await GuardianUser.findOne({ 
    where: { obId: guardian.obId, userId: studentId } 
  })
  if (!link) {
    throw Object.assign(new Error('Student not found for this guardian'), { status: 404 })
  }

  const student = await User.findByPk(studentId)
  if (!student) {
    throw Object.assign(new Error('Student not found'), { status: 404 })
  }

  // Check username/email uniqueness if changed
  if (studentData.username && studentData.username !== student.username) {
    const existing = await User.findOne({ where: { username: studentData.username } })
    if (existing) throw Object.assign(new Error('Username already taken'), { status: 400 })
  }
  if (studentData.email && studentData.email !== student.email) {
    const existing = await User.findOne({ where: { email: studentData.email } })
    if (existing) throw Object.assign(new Error('Email already taken'), { status: 400 })
  }

  // Update student data
  await student.update({
    fullname: studentData.fullname || student.fullname,
    username: studentData.username || student.username,
    email: studentData.email || student.email,
    phoneNumber: studentData.phoneNumber || student.phoneNumber
  })

  return {
    message: 'Student updated successfully',
    data: {
      student: {
        id: student.id,
        username: student.username,
        fullname: student.fullname,
        email: student.email,
        phoneNumber: student.phoneNumber
      }
    }
  }
}

export const deleteStudentByGuardianId = async (obId, studentId) => {
  const guardian = await Guardian.findOne({ where: { obId } })
  if (!guardian) {
    throw Object.assign(new Error('Guardian not found'), { status: 404 })
  }

  // Check if student belongs to guardian
  const link = await GuardianUser.findOne({ 
    where: { obId: guardian.obId, userId: studentId } 
  })
  if (!link) {
    throw Object.assign(new Error('Student not found for this guardian'), { status: 404 })
  }

  // Delete link and student user
  await GuardianUser.destroy({ where: { obId: guardian.obId, userId: studentId } })
  await User.destroy({ where: { id: studentId } })

  return {
    message: 'Student deleted successfully'
  }
}
