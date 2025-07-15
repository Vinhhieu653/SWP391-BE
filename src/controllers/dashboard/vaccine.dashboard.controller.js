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

export const countAllVaccineStatuses = async (req, res, next) => {
  try {
    const [pending, allowed, injected, rejected] = await Promise.all([
      dashboardService.countByStatus('Chờ xác nhận'),
      dashboardService.countByStatus('Cho phép tiêm'),
      dashboardService.countByStatus('Đã tiêm'),
      dashboardService.countByStatus('Không tiêm')
    ])

    res.json({
      countPending: pending,
      countAllowed: allowed,
      countInjected: injected,
      countRejected: rejected
    })
  } catch (err) {
    next(err)
  }
}
