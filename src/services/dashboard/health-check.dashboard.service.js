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

export const countCreatedStudents = () => HealthCheck.count({ where: { status: 'created' } })

export const countInProgressStudents = () => HealthCheck.count({ where: { status: 'in progress' } })

export const countPendingStudents = () => HealthCheck.count({ where: { status: 'pending' } })

export const countCheckedRounds = () => HealthCheck.count({ where: { status: 'checked' } })
