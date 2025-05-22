import User from '../../models/data/user.model.js'
import Role from '../../models/data/role.model.js'
import argon2 from 'argon2'

const users = [
  { username: 'admin', email: 'admin@example.com', password: 'Login123@', roleName: 'admin' },
  { username: 'nurse1', email: 'nurse1@example.com', password: 'Login123@', roleName: 'nurse' },
  { username: 'student1', email: 'student1@example.com', password: 'Login123@', roleName: 'student' },
  { username: 'parent1', email: 'parent1@example.com', password: 'Login123@', roleName: 'parent' },
  { username: 'manager1', email: 'manager1@example.com', password: 'Login123@', roleName: 'manager' }
]

export async function seedUsers() {
  for (const u of users) {
    const passwordHash = await argon2.hash(u.password)
    const role = await Role.findOne({ where: { name: u.roleName } })
    if (!role) {
      console.log(`Role ${u.roleName} not found. Skip user ${u.username}`)
      continue
    }

    const [user, created] = await User.findOrCreate({
      where: { username: u.username },
      defaults: {
        email: u.email,
        password: passwordHash,
        roleId: role.id
      }
    })

    if (created) {
      console.log(`Created user: ${u.username} with role ${u.roleName}`)
    }
  }
}
