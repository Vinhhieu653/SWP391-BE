import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import sequelize from './database/db.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './configs/swagger.config.js'
import testRoute from './routes/test.route.js'
import loginRouter from './routes/auth/login.route.js'
import logoutRouter from './routes/auth/logout.route.js'
import blogRoutes from './routes/blog/blog.route.js'
import refreshTokenRouter from './routes/auth/refresh-token.route.js'
import registerRouter from './routes/auth/register.route.js'
import uploadRouter from './routes/upload-img/upload-img.route.js'
import { basicAuth } from './middlewares/authSwagger.js'
import { notFoundHandler, errorHandler } from './middlewares/api-response/responseUtils.js'
import User from './models/data/user.model.js'
import Role from './models/data/role.model.js'
import Blog from './models/data/blog.model.js'
import Image from './models/data/image.model.js'
import { seedRoles } from './database/seeds/role.seed.js'
import { seedUsers } from './database/seeds/users.seed.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333

// Middleware chung
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Docs route
app.use(
  '/api-docs',
  basicAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true
    }
  })
)

// Root
app.get('/', (req, res) => res.send('API is running...'))

// Routes chính
app.use(testRoute)
app.use('/api/v1/auth', loginRouter)
app.use('/api/v1/auth', logoutRouter)
app.use('/api/v1/auth', refreshTokenRouter)
app.use('/api/v1/users', registerRouter)
app.use('/api/v1/blogs', blogRoutes)
app.use('/api/v1/upload', uploadRouter)

// Xử lý lỗi
app.use(notFoundHandler)
app.use(errorHandler)

// Start server và kết nối DB
async function startServer() {
  try {
    await sequelize.authenticate()
    console.log('PostgreSQL connected ✅')

    // Tạo bảng
    await sequelize.sync({ alter: true })

    //tạo seeds
    await seedRoles()
    await seedUsers()

    app.listen(PORT, () => {
      console.log(`Server chạy tại http://localhost:${PORT}/api-docs/`)
    })
  } catch (err) {
    console.error('DB connect error ❌', err)
    process.exit(1)
  }
}

startServer()
