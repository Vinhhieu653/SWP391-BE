import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import sequelize from './database/db.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './configs/swagger.js'
import testRoute from './routes/test.route.js'
import loginRouter from './routes/login.js'
import logoutRouter from './routes/logout.js'
import testRouter from './routes/testRouter.js'
import { basicAuth } from './middlewares/authSwagger.js'
import { notFoundHandler, errorHandler } from './middlewares/api-response/responseUtils.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333

// Middleware chung
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Docs route
app.use('/api-docs', basicAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Root
app.get('/', (req, res) => res.send('API is running...'))

// Routes chính
app.use(testRoute)
app.use(testRouter)
app.use('/api/v1/auth', loginRouter)
app.use('/api/v1/auth', logoutRouter)

// Xử lý lỗi
app.use(notFoundHandler)
app.use(errorHandler)

// Start server và kết nối DB
async function startServer() {
  try {
    await sequelize.authenticate()
    console.log('PostgreSQL connected ✅')

    app.listen(PORT, () => {
      console.log(`Server chạy tại http://localhost:${PORT}/api-docs/`)
    })
  } catch (err) {
    console.error('DB connect error ❌', err)
    process.exit(1)
  }
}

startServer()
