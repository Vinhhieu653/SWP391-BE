import HealthCheck from '../../models/data/health_check.model.js'
import FormCheck from '../../models/data/form_check.model.js'
import { Op } from 'sequelize'
import User from '../../models/data/user.model.js'
import Guardian from '../../models/data/guardian.model.js'

export const countHealthChecks = async () => {
  const count = await HealthCheck.count()
  return count
}

export const countCheckedStudents = async () => {
  const count = await FormCheck.count({
    where: {
      Height: { [Op.ne]: null } // hoặc field nào m dùng để đánh dấu "đã khám"
    }
  })
  return count
}

export const getGuardianConfirmationRate = async () => {
  const total = await FormCheck.count()
  const confirmed = await FormCheck.count({
    where: {
      status: {
        [Op.in]: ['approved', 'checked'] // hoặc status m định nghĩa là "đã xác nhận"
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

export const countUncheckedStudents = async () => {
  const count = await FormCheck.count({
    where: {
      Height: null // hoặc field nào m check là chưa khám
    }
  })
  return count
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

export const countHealthIssues = async () => {
  return await FormCheck.count({
    where: {
      General_Conclusion: {
        [Op.notILike]: '%bình thường%' // hoặc field nào chứa bệnh
      }
    }
  })
}
