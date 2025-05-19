import { refreshAccessToken } from '../../services/auth/refresh-token.service.js'
import { apiResponse } from '../../middlewares/api-response/responseUtils.js'

export const refreshTokenController = async (req, res) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
        return apiResponse(res, { status: 401, success: false, message: 'Missing refresh token' })
    }

    try {
        const newAccessToken = await refreshAccessToken(refreshToken)
        return apiResponse(res, {
            status: 200,
            success: true,
            message: 'Token refreshed',
            data: { accessToken: newAccessToken },
        })
    } catch (error) {
        return apiResponse(res, { status: error.status || 403, success: false, message: error.message })
    }
}
