import User from '../../models/data/user.model.js'
import argon2 from 'argon2'
import { sendRandomPasswordMail, sendResetPasswordMail } from '../../services/send-mail/email.service.js'
import jwt from 'jsonwebtoken'

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error('Người dùng không tồn tại')

  const isMatch = await argon2.verify(user.password, currentPassword)
  if (!isMatch) throw new Error('Sai mật khẩu hiện tại')

  const hashed = await argon2.hash(newPassword)
  user.password = hashed
  await user.save()
}

function generateRandomPassword(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export const sendRandomPassword = async (email) => {
  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error('Không tìm thấy người dùng với email này')
  if (user.roleId !== 4) throw new Error('Tài khoản này không phải phụ huynh')

  const newPassword = generateRandomPassword(6)
  const hashed = await argon2.hash(newPassword)
  user.password = hashed
  await user.save()

  const actionLink = `${process.env.FRONTEND_URL || 'http://localhost:5173/'}/reset-password?email=${encodeURIComponent(email)}`

  await sendRandomPasswordMail({
    to: email,
    studentName: user.fullname || 'Phụ huynh',
    password: newPassword,
    actionLink
  })
}

export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error('Email không tồn tại')

  // Nếu là phụ huynh → gửi mật khẩu random
  if (user.roleId === 4) {
    const newPassword = generateRandomPassword(6)
    const hashed = await argon2.hash(newPassword)
    user.password = hashed
    await user.save()

    const actionLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?email=${encodeURIComponent(email)}`

    await sendRandomPasswordMail({
      to: email,
      studentName: user.fullname || 'Phụ huynh',
      password: newPassword,
      actionLink
    })
  } else {
    // Các role khác → gửi link reset bằng token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' })
    const actionLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`

    await sendResetPasswordMail({
      to: email,
      studentName: user.fullname || 'Người dùng',
      actionLink,
      year: new Date().getFullYear()
    })
  }
}
