import redisClient from '../../configs/redisClient.config.js'

const logoutService = async (refreshToken) => {
    const stored = await redisClient.get(refreshToken)
    if (!stored) {
        throw new Error('Refresh token invalid or already logged out')
    }

    await redisClient.del(refreshToken)
    return 'Logged out successfully'
}

export default logoutService
