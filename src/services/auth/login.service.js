import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import redisClient from '../../configs/redisClient.config.js'
import users from '../../models/data/user.model.js'

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1d'
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'

export const loginService = async (username, password) => {
  const user = users.find((u) => u.username === username)
  if (!user) throw { status: 401, message: 'Invalid credentials' }

  const validPassword = await argon2.verify(user.passwordHash, password)
  if (!validPassword) throw { status: 401, message: 'Invalid credentials' }

  const accessToken = jwt.sign({ userId: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN })
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })

  await redisClient.set(refreshToken, user.id.toString(), {
    EX: 7 * 24 * 60 * 60 // 7 ngày
  })

  return { accessToken, refreshToken }
}
