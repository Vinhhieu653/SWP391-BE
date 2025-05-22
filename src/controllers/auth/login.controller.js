import { loginService } from '../../services/auth/login.service.js'

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body
    const { accessToken, refreshToken, user } = await loginService(username, password)

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user
      }
    })
  } catch (error) {
    res.status(error.status || 500).json({
      status: error.status || 500,
      success: false,
      message: error.message || 'Server error',
      data: null
    })
  }
}
