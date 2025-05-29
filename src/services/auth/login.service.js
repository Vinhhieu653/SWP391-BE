import User from '../../models/data/user.model.js'
import Role from '../../models/data/role.model.js'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import redisClient from '../../configs/redisClient.config.js'
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from '../../configs/env.config.js'

export const loginService = async (email, password) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role }]
  })

  if (!user) throw { status: 401, message: 'Invalid credentials' }

  const validPassword = await argon2.verify(user.password, password)
  if (!validPassword) throw { status: 401, message: 'Invalid credentials' }

  const roleName = user.Role?.name || 'user'

  const accessToken = jwt.sign({ userId: user.id, role: roleName }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN
  })

  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })

  await redisClient.set(refreshToken, user.id.toString(), {
    EX: 7 * 24 * 60 * 60
  })

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: roleName
    }
  }
}
