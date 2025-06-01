import { validationResult } from 'express-validator'
import { apiResponse } from '../../middlewares/responseUtils.js'
import logoutService from '../../services/auth/logout.service.js'

const logoutController = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return apiResponse(res, {
      status: 400,
      success: false,
      message: errors.array()[0].msg
    })
  }

  const { refreshToken } = req.body

  try {
    const result = await logoutService(refreshToken)
    return apiResponse(res, {
      status: 200,
      success: true,
      message: result
    })
  } catch (err) {
    return apiResponse(res, {
      status: 400,
      success: false,
      message: err.message
    })
  }
}

export default logoutController
