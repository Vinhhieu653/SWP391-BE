import * as healthCheckDashboardService from '../../services/dashboard/health-check.dashboard.service.js'

export const getHealthCheckCount = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countHealthChecks()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const getCheckedStudentsCount = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countCheckedStudents()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const getUncheckedStudentsCount = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countUncheckedStudents()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countHealthIssues = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countHealthIssues()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countApprovedStudents = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countApprovedStudents()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countRejectedStudents = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countRejectedStudents()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countPendingStudents = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countPendingStudents()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countCheckedRounds = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countCheckedRounds()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}
