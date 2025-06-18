import User from '../../models/data/user.model.js'
import argon2 from 'argon2'

export async function changePassword(userId, currentPassword, newPassword) {
  const user = await User.findByPk(userId)
  if (!user) throw new Error('Người dùng không tồn tại')

  const isMatch = await argon2.verify(user.password, currentPassword)
  if (!isMatch) throw new Error('Sai mật khẩu hiện tại')

  const hashedNewPassword = await argon2.hash(newPassword)
  user.password = hashedNewPassword
  await user.save()
}
