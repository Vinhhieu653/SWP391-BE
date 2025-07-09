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
