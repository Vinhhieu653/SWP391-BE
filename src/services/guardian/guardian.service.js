import User from '../../models/data/user.model.js'
import Guardian from '../../models/data/guardian.model.js'
import GuardianUser from '../../models/data/guardian_user.model.js'
import * as registerService from '../auth/register.service.js'

// Create guardian with associated student users
export const createGuardianWithStudents = async ({ guardian, students }) => {
  if (!guardian || !Array.isArray(students)) {
    const error = new Error('Missing guardian or students data')
    error.status = 400
    throw error
  }

  // Check unique username/email
  const existingUsername = await User.findOne({ where: { username: guardian.username } })
  if (existingUsername) throw Object.assign(new Error('Guardian username already taken'), { status: 400 })
  const existingEmail = await User.findOne({ where: { email: guardian.email } })
  if (existingEmail) throw Object.assign(new Error('Guardian email already taken'), { status: 400 })

  // Register guardian user
  const guardianUser = await registerService.registerUser({
    fullname: guardian.fullname,
    username: guardian.username,
    email: guardian.email,
    password: guardian.password,
    phoneNumber: guardian.phoneNumber,
    roleId: 4
  })

  // Create Guardian record
  const guardianRecord = await Guardian.create({
    phoneNumber: guardian.phoneNumber,
    roleInFamily: guardian.roleInFamily,
    isCallFirst: guardian.isCallFirst,
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

// Get all guardians with their student lists
export const getAllGuardians = async () => {
  const guardians = await Guardian.findAll()

  const result = await Promise.all(
    guardians.map(async (guardian) => {
      const guardianUser = await User.findByPk(guardian.userId, {
        attributes: ['id', 'username', 'fullname', 'email', 'phoneNumber']
      })

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
        fullname: guardianUser.fullname,
        students
      }
    })
  )
  return result
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
