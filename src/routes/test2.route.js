import express from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

router.post(
  '/test',
  body('name').isString().withMessage('Name phải là chuỗi'),
  body('age').isInt({ min: 1 }).withMessage('Age phải là số nguyên dương'),
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    res.json({ message: `Hello ${req.body.name}, age ${req.body.age}` })
  }
)

export default router
