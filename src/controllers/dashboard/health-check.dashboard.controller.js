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

export const countCreatedStudents = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countCreatedStudents()
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

export const countInProgressStudents = async (req, res, next) => {
  try {
    const count = await healthCheckDashboardService.countInProgressStudents()
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

export const countAllHealthCheckStatuses = async (req, res, next) => {
  try {
    const [
      created,
      inProgress,
      pending,
      checked
    ] = await Promise.all([
      healthCheckDashboardService.countCreatedStudents(),
      healthCheckDashboardService.countInProgressStudents(),
      healthCheckDashboardService.countPendingStudents(),
      healthCheckDashboardService.countCheckedRounds()
    ]);

    res.json({
      countCreated: created,
      countInProgress: inProgress,
      countPending: pending,
      countChecked: checked
    });
  } catch (err) {
    next(err);
  }
}
