import { fn, col, literal } from 'sequelize'
import Event from '../../models/data/event.model.js'
import OtherMedical from '../../models/data/other_medical.model.js'
import HistoryOtherMedical from '../../models/data/history_other_medical.model.js'
import User from '../../models/data/user.model.js'
import Blog from '../../models/data/blog.model.js'
import HealthCheck from '../../models/data/health_check.model.js'
import VaccineHistory from '../../models/data/vaccine_history.model.js'
import MedicalRecord from '../../models/data/medicalRecord.model.js'

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

export const countOtherMedical = async () => {
  const count = await OtherMedical.count()
  return count
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

export const countOtherMedicalMonthly = async () => {
  const result = await HistoryOtherMedical.findAll({
    attributes: [
      [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
      [fn('COUNT', '*'), 'count']
    ],
    group: [literal('month')],
    order: [[literal('month'), 'ASC']]
  })

  const rawData = result.reduce((acc, item) => {
    const date = item.getDataValue('month')
    const key = date.toLocaleDateString('en-GB', {
      month: '2-digit',
      year: 'numeric'
    }) // "07/2025"
    acc[key] = Number(item.getDataValue('count'))
    return acc
  }, {})

  const now = new Date()
  const months = []
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = d.toLocaleDateString('en-GB', {
      month: '2-digit',
      year: 'numeric'
    })
    months.push({ name: key, value: rawData[key] || 0 })
  }

  return months.reverse()
}

export const countUsers = async () => {
  const count = await User.count()
  return count - 1
}

export const countBlog = async () => {
  const count = await Blog.count()
  return count
}

export const countHealthChecks = async () => {
  const count = await HealthCheck.count()
  return count
}

export const countVaccineRounds = async () => {
  const count = await VaccineHistory.count()
  return count
}

export const countMedicalRecords = async () => {
  const count = await MedicalRecord.count()
  return count
}
