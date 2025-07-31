import User from '../../models/data/user.model.js'
import Role from '../../models/data/role.model.js'
import argon2 from 'argon2'

const users = [
  {
    fullname: 'Admin User',
    username: 'admin',
    email: 'admin@example.com',
    password: 'Login123@',
    phoneNumber: '0123456789',
    roleName: 'admin',
    dateOfBirth: '1990-01-01',
    gender: 'male'
  },
  {
    fullname: 'Nurse One',
    username: 'nurse1',
    email: 'nurse1@example.com',
    password: 'Login123@',
    phoneNumber: '0987654321',
    roleName: 'nurse',
    dateOfBirth: '1992-03-15',
    gender: 'female'
  },
  {
    fullname: 'Guardian One',
    username: 'guardian1',
    email: 'guardian1@example.com',
    password: 'Login123@',
    phoneNumber: '0911223344',
    roleName: 'guardian',
    dateOfBirth: '1985-05-20',
    gender: 'female'
  },
  {
    fullname: 'Nurse two',
    username: 'nurse2',
    email: 'nurse2@example.com',
    password: 'Login123@',
    phoneNumber: '0987654321',
    roleName: 'nurse',
    dateOfBirth: '1991-11-30',
    gender: 'female'
  }
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
        fullname: u.fullname,
        email: u.email,
        password: passwordHash,
        phoneNumber: u.phoneNumber,
        roleId: role.id,
        dateOfBirth: u.dateOfBirth,
        gender: u.gender
      }
    })

    if (created) {
      console.log(`✅ Created user: ${u.username} with role ${u.roleName}`)
    }
  }
}
