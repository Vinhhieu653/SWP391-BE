import { loginService } from '../../services/auth/login.service.js'

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body
    const { accessToken, refreshToken, user } = await loginService(email, password)

    res.status(201).json({
      status: 201,
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user,
        email
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
