import User from '../../models/data/user.model.js'
import Role from '../../models/data/role.model.js'
import argon2 from 'argon2'

export async function registerUser({ fullname, username, email, phoneNumber, roleId, dateOfBirth, gender }) {
  if (!fullname || !username || !email) {
    throw new Error('Missing required fields')
  }

  const existUser = await User.findOne({ where: { username } })
  if (existUser) throw new Error('Username taken')

  let finalRoleId = roleId
  if (!finalRoleId) {
    const role = await Role.findOne({ where: { name: 'nurse' } })
    if (!role) throw new Error('Role not found')
    finalRoleId = role.id
  }

  const existEmail = await User.findOne({ where: { email } })
  if (existEmail) throw new Error('Email taken')

  const newUser = await User.create({
    fullname,
    username,
    email,
    phoneNumber,
    roleId: finalRoleId,
    dateOfBirth,
    gender
  })

  return newUser
}

export async function getAllUsers() {
  const users = await User.findAll({
    attributes: ['id', 'username', 'fullname', 'email', 'phoneNumber', 'roleId', 'dateOfBirth', 'gender']
  })
  return users
}

export async function getUserById(userId) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] }, // ẩn pass
    include: [{ model: Role, attributes: ['name'] }]
  })
  if (!user) throw new Error('User not found')
  return user
}

export async function updateUser(userId, { username, fullname, email, phoneNumber, dateOfBirth, gender }) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error('User not found')

  if (username && username !== user.username) {
    const existUser = await User.findOne({ where: { username } })
    if (existUser) throw new Error('Username taken')
    user.username = username
  }

  if (fullname && fullname !== user.fullname) {
    user.fullname = fullname
  }

  if (email && email !== user.email) {
    const existEmail = await User.findOne({ where: { email } })
    if (existEmail) throw new Error('Email taken')
    user.email = email
  }

  if (phoneNumber) {
    user.phoneNumber = phoneNumber
  }

  if (dateOfBirth) {
    user.dateOfBirth = dateOfBirth
  }

  if (gender) {
    user.gender = gender
  }

  await user.save()
  return user
}

export async function deleteUser(userId) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error('User not found')
  if (user.roleId === 1) throw new Error('Cannot delete admin user')
  await user.destroy()
  return user
}
