// services/guardian/createGuardian.service.js
import Guardian from '../../models/data/guardian.model.js'
import User from '../../models/data/user.model.js'
import GuardianUser from '../../models/data/guardian_user.model.js'
import argon2 from 'argon2'

export async function createGuardian(guardianData) {
  const { username, email, phoneNumber, fullname, dateOfBirth, gender, address } = guardianData

  const existedUser = await User.findOne({ where: { username } })
  if (existedUser) throw new Error(`Username ${username} đã tồn tại`)

  const password = await argon2.hash('123456') // default password
  const user = await User.create({ username, email, phoneNumber, password, role: 'guardian' })

  const guardian = await Guardian.create({
    userId: user.id,
    fullname,
    dateOfBirth,
    gender,
    address
  })

  // GuardianUser có thể không cần nếu không gắn student ngay
  return guardian
}
