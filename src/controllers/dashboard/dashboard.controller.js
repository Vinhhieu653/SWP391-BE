import * as dashboardService from '../../services/dashboard/dashboard.service.js'

export const getGuardianConfirmationRate = async (req, res, next) => {
  try {
    const result = await dashboardService.getGuardianConfirmationRate()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const countUsers = async (req, res, next) => {
  try {
    const count = await dashboardService.countUsers()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countStudents = async (req, res, next) => {
  try {
    const count = await dashboardService.countStudents()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countGuardians = async (req, res, next) => {
  try {
    const count = await dashboardService.countGuardians()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}
