import HealthCheck from '../../models/data/health_check.model.js'
import FormCheck from '../../models/data/form_check.model.js'
import { Op } from 'sequelize'

export const countHealthChecks = async () => {
  const count = await HealthCheck.count()
  return count
}

export const countCheckedStudents = async () => {
  const count = await FormCheck.count({
    where: {
      Height: { [Op.ne]: null }
    }
  })
  return count
}

export const countUncheckedStudents = async () => {
  const count = await FormCheck.count({
    where: {
      Height: null
    }
  })
  return count
}

export const countHealthIssues = async () => {
  return await FormCheck.count({
    where: {
      General_Conclusion: {
        [Op.notILike]: '%bình thường%'
      }
    }
  })
}

export const countApprovedStudents = () => FormCheck.count({ where: { status: 'approved' } })

export const countRejectedStudents = () => FormCheck.count({ where: { status: 'rejected' } })

export const countPendingStudents = () => FormCheck.count({ where: { status: 'pending' } })

export const countCheckedRounds = () => FormCheck.count({ where: { status: 'checked' } })
