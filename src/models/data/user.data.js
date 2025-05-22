import argon2 from 'argon2'

const users = [
    {
        id: 1,
        username: 'admin',
        passwordHash: await argon2.hash('123456')
    }
]

export default users
