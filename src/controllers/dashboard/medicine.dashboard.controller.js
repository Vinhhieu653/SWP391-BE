import * as dashboardService from '../../services/dashboard/medicine.dashboard.service.js'

export const countTotalPrescriptions = async (req, res, next) => {
  try {
    const count = await dashboardService.countTotalPrescriptions()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countPendingPrescriptions = async (req, res, next) => {
  try {
    const count = await dashboardService.countPendingPrescriptions()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countReceivedPrescriptions = async (req, res, next) => {
  try {
    const count = await dashboardService.countReceivedPrescriptions()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countRejectedPrescriptions = async (req, res, next) => {
  try {
    const count = await dashboardService.countRejectedPrescriptions()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countGivenPrescriptions = async (req, res, next) => {
  try {
    const count = await dashboardService.countGivenPrescriptions()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}
