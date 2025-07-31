import VaccineHistory from '../../models/data/vaccine_history.model.js'
import { Op, fn, col, literal } from 'sequelize'

export const countVaccineRounds = () => {
  return VaccineHistory.count()
}

export const countByStatus = async (status) => {
  return VaccineHistory.count({ where: { Status: status } })
}

export const countRoundsByMonth = async () => {
  const result = await VaccineHistory.findAll({
    attributes: [
      [fn('DATE_TRUNC', 'month', col('Date_injection')), 'month'],
      [fn('COUNT', '*'), 'count']
    ],
    group: [literal('month')],
    order: [[literal('month'), 'ASC']]
  })
  return result.map((r) => ({
    month: r.dataValues.month,
    count: Number(r.dataValues.count)
  }))
}
