// seeds/role.seed.js
import Role from '../../models/data/role.model.js'

const roles = ['admin', 'nurse', 'student', 'parent', 'manager']

export async function seedRoles() {
  const existingRoles = await Role.findAll()
  const existingRoleNames = existingRoles.map((r) => r.name)

  // Xóa role không còn trong roles list
  for (const role of existingRoles) {
    if (!roles.includes(role.name)) {
      await db.User.destroy({ where: {}, truncate: true })
      await db.Role.destroy({ where: {}, truncate: true })
      console.log(`Removed role: ${role.name}`)
    }
  }

  // Tạo role mới
  for (const role of roles) {
    const [instance, created] = await Role.findOrCreate({ where: { name: role } })
    if (created) console.log(`Created role: ${role}`)
  }
}
