import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' })
    req.user = decoded
    next()
  })
}

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role
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
