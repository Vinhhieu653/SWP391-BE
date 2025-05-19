import jwt from 'jsonwebtoken'
import redisClient from '../../configs/redisClient.config.js'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1d'

export const refreshAccessToken = async (refreshToken) => {
    let decoded
    try {
        decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)
    } catch {
        const error = new Error('Invalid or expired token')
        error.status = 403
        throw error
    }

    const storedUserId = await redisClient.get(refreshToken)
    if (!storedUserId || storedUserId !== decoded.userId.toString()) {
        const error = new Error('Invalid refresh token')
        error.status = 403
        throw error
    }

    const newAccessToken = jwt.sign({ userId: decoded.userId }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    })

    return newAccessToken
}
