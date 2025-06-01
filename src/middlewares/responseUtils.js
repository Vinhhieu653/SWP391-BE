// responseUtils.js

export const apiResponse = (res, { status = 200, success = true, message = '', data = null }) => {
  return res.status(status).json({ status, success, message, data })
}

export const notFoundHandler = (req, res) => {
  return res.status(404).json({
    status: 404,
    success: false,
    message: 'Route not found'
  })
}

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack || err)
  return res.status(500).json({
    status: 500,
    success: false,
    message: 'Internal Server Error'
  })
}
