import Role from '../../models/data/role.model.js'

const roles = [
  { name: 'admin', description: 'System administrator' },
  { name: 'nurse', description: 'School nurse' },
  { name: 'student', description: 'Student role' },
  { name: 'guardian', description: 'Guardian of a student' }
]

export async function seedRoles() {
  for (const role of roles) {
    const [instance, created] = await Role.findOrCreate({
      where: { name: role.name },
      defaults: {
        description: role.description
      }
    })

    if (created) {
      console.log(`✅ Created role: ${role.name}`)
    }
  }
}
