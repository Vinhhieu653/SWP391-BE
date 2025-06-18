import * as authService from '../../services/auth/auth.service.js'

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId
    const { currentPassword, newPassword } = req.body

    await authService.changePassword(userId, currentPassword, newPassword)
    res.status(200).json({ message: 'Đổi mật khẩu thành công' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}
