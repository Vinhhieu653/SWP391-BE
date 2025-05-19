import { loginService } from '../../services/auth/login.service.js'
import { apiResponse } from '../../middlewares/api-response/responseUtils.js'

export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body
        const result = await loginService(username, password)
        return apiResponse(res, {
            status: 201,
            message: 'Login successful',
            data: result
        })
    } catch (err) {
        return apiResponse(res, {
            status: err.status || 500,
            success: false,
            message: err.message || 'Server error'
        })
    }
}
