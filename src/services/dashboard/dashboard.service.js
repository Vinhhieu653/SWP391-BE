import FormCheck from '../../models/data/form_check.model.js'
import { Op } from 'sequelize'
import User from '../../models/data/user.model.js'
import Guardian from '../../models/data/guardian.model.js'

export const getGuardianConfirmationRate = async () => {
  const total = await FormCheck.count()
  const confirmed = await FormCheck.count({
    where: {
      status: {
        [Op.in]: ['approved', 'checked']
      }
    }
  })

  const percentage = total > 0 ? (confirmed / total) * 100 : 0

  return {
    confirmed,
    total,
    percentage: Math.round(percentage * 10) / 10
  }
}

export const countUsers = async () => {
  return await User.count()
}

export const countStudents = async () => {
  const result = await FormCheck.aggregate('Student_ID', 'count', {
    distinct: true
  })
  return result
}

export const countGuardians = async () => {
  const count = await Guardian.count()
  return count
}
