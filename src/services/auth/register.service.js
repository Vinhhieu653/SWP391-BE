import User from '../../models/data/user.model.js'
import Role from '../../models/data/role.model.js'
import argon2 from 'argon2'

export async function registerUser({ username, email, password, phoneNumber }) {
  const existUser = await User.findOne({ where: { username } })
  if (existUser) throw new Error('Username taken')

  const existEmail = await User.findOne({ where: { email } })
  if (existEmail) throw new Error('Email taken')

  const role = await Role.findOne({ where: { name: 'student' } })
  if (!role) throw new Error('Role not found')

  const hashedPassword = await argon2.hash(password)

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    phoneNumber,
    roleId: role.id,
    status: 'pending'
  })

  return newUser
}

export async function approveUser(userId) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error('User not found')
  if (user.status === 'approved') throw new Error('User already approved')

  user.status = 'approved'
  await user.save()
  return user
}

export async function rejectUser(userId) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error('User not found')
  if (user.status === 'approved') throw new Error('User already approved, cannot reject')
  if (user.status === 'rejected') throw new Error('User already rejected')

  user.status = 'rejected'
  await user.save()
  return user
}

export async function deleteUser(userId) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error('User not found')
  if (user.status !== 'approved') throw new Error('Only approved users can be deleted')

  await user.destroy()
  return user
}

export async function getAllUsers() {
  const users = await User.findAll({
    attributes: ['id', 'username', 'email', 'phoneNumber', 'status', 'roleId']
  })
  return users
}

export async function updateUser(userId, { username, email, phoneNumber }) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error('User not found')

  if (username && username !== user.username) {
    const existUser = await User.findOne({ where: { username } })
    if (existUser) throw new Error('Username taken')
    user.username = username
  }

  if (email && email !== user.email) {
    const existEmail = await User.findOne({ where: { email } })
    if (existEmail) throw new Error('Email taken')
    user.email = email
  }

  if (phoneNumber) {
    user.phoneNumber = phoneNumber
  }

  await user.save()
  return user
}
