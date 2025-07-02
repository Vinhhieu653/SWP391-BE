import * as authService from '../../services/auth/password.service.js'

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

export const sendRandomPassword = async (req, res) => {
  try {
    const { email } = req.body
    await authService.sendRandomPassword(email)
    res.status(200).json({ message: 'Mật khẩu mới đã được gửi qua email' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    await authService.forgotPasswordService(email)
    res.status(200).json({ message: 'Đã gửi email đặt lại mật khẩu' })
  } catch (err) {
    next(err)
  }
}
