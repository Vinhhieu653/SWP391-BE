import { fn, col, literal } from 'sequelize'
import Event from '../../models/data/event.model.js'

export const countVaccineEventsByMonth = async () => {
  const result = await Event.findAll({
    attributes: [
      [fn('DATE_TRUNC', 'month', col('dateEvent')), 'month'],
      [fn('COUNT', '*'), 'count']
    ],
    where: {
      type: 'Vaccine'
    },
    group: [literal('month')],
    order: [[literal('month'), 'ASC']]
  })

  return result.map((item) => ({
    month: item.get('month'),
    count: parseInt(item.get('count'))
  }))
}

export const countHealthCheckEventsMonthly = async () => {
  const result = await Event.findAll({
    attributes: [
      [fn('DATE_TRUNC', 'month', col('dateEvent')), 'month'],
      [fn('COUNT', col('eventId')), 'count']
    ],
    where: {
      type: 'Health Check'
    },
    group: [literal('month')],
    order: [[literal('month'), 'ASC']]
  })

  return result.map((item) => ({
    month: item.getDataValue('month'),
    count: Number(item.getDataValue('count'))
  }))
}
