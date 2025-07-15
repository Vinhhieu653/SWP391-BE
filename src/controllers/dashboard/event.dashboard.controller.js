import * as eventDashboardService from '../../services/dashboard/event.dashboard.service.js'

export const getVaccineEventsByMonth = async (req, res, next) => {
  try {
    const result = await eventDashboardService.countVaccineEventsByMonth()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getHealthCheckEventsByMonth = async (req, res, next) => {
  try {
    const result = await eventDashboardService.countHealthCheckEventsMonthly()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getOtherMedicalCount = async (req, res, next) => {
  try {
    const count = await eventDashboardService.countOtherMedical()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const getOtherMedicalCountMonthly = async (req, res, next) => {
  try {
    const count = await eventDashboardService.countOtherMedicalMonthly()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const getDashboardCounts = async (req, res, next) => {
  try {
    const [
      countUsers,
      countBlog,
      countVaccineRounds,
      countHealthChecks
    ] = await Promise.all([
      eventDashboardService.countUsers(),
      eventDashboardService.countBlog(),
      eventDashboardService.countVaccineRounds(),
      eventDashboardService.countHealthChecks()
    ])

    res.json({
      countUsers,
      countBlog,
      countVaccineRounds,
      countHealthChecks
    })
  } catch (err) {
    next(err)
  }
}

export const getCountMedicalRecord = async (req, res, next) => {
  try {
    const count = await eventDashboardService.countMedicalRecords()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}
