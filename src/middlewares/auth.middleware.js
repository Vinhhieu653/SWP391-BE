export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role // giả sử đã decode token và gán req.user

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: 'Forbidden: You do not have permission',
        data: null
      })
    }
    next()
  }
}
