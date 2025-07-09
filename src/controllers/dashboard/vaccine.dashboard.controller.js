import * as dashboardService from '../../services/dashboard/vaccine.dashboard.service.js'

export const countVaccineRounds = async (req, res, next) => {
  try {
    const count = await dashboardService.countVaccineRounds()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countVaccineByStatus = (status) => async (req, res, next) => {
  try {
    const count = await dashboardService.countByStatus(status)
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const getRoundsByMonth = async (req, res, next) => {
  try {
    const result = await dashboardService.countRoundsByMonth()
    res.json(result)
  } catch (err) {
    next(err)
  }
}
