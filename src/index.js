import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import sequelize from './database/db.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './configs/swagger.config.js'
import http from 'http'
import { initSocket } from './configs/socket.config.js'
import notifyRoute from './routes/notify.route.js'
import testRoute from './routes/test.route.js'
import loginRouter from './routes/auth/login.route.js'
import logoutRouter from './routes/auth/logout.route.js'
import blogRouter from './routes/blog/blog.route.js'
import categoryRouter from './routes/blog/category.route.js'
import refreshTokenRouter from './routes/auth/refresh-token.route.js'
import medicalRecordRouter from './routes/medical-record/medical-record.route.js'
import registerRouter from './routes/auth/register.route.js'
import uploadRouter from './routes/upload-img/upload-img.route.js'
import emailRouter from './routes/send-mail/email.route.js'
import otherMedicalRouter from './routes/Other_medical/Other_medical.router.js'
import guardianRouter from './routes/guardian/guardian.route.js'
import healthCheckRouter from './routes/health-check/health-check.route.js'
import vaccineRouter from './routes/vaccince/Vaccine.router.js'
import { basicAuth } from './middlewares/authSwagger.js'
import { notFoundHandler, errorHandler } from './middlewares/responseUtils.js'
import { seedRoles } from './database/seeds/role.seed.js'
import { seedUsers } from './database/seeds/users.seed.js'
import { seedBlogs } from './database/seeds/blogs.seed.js'
import { seedCategories } from './database/seeds/category.seed.js'
import applyAssociations from './models/associate/associate.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333

const server = http.createServer(app)
const io = initSocket(server)

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

// Inject io vào req
app.use((req, res, next) => {
  req.io = io
  next()
})

// Root
app.get('/', (req, res) => res.send('API is running...'))

// Routes chính
app.use(testRoute)
app.use('/api/v1/auth', loginRouter)
app.use('/api/v1/auth', logoutRouter)
app.use('/api/v1/auth', refreshTokenRouter)
app.use('/api/v1/users', registerRouter)
app.use('/api/v1/blogs', blogRouter)
app.use('/api/v1/upload', uploadRouter)
app.use('/api/v1', emailRouter)
app.use('/api/v1/notify', notifyRoute)
app.use('/api/v1/other-medical', otherMedicalRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/guardians', guardianRouter)
app.use('/api/v1/health-check', healthCheckRouter)
app.use('/api/v1/vaccine', vaccineRouter)

app.use('/api/v1/medical-records', medicalRecordRouter)
// Xử lý lỗi
app.use(notFoundHandler)
app.use(errorHandler)

// Start server và kết nối DB
async function startServer() {
  try {
    await sequelize.authenticate()
    console.log('PostgreSQL connected ✅')

    applyAssociations()
    // Tạo bảng
    await sequelize.sync({ alter: true })

    //tạo seeds
    await seedRoles()
    await seedUsers()
    await seedCategories()
    await seedBlogs()
    // await seedMedicalRecords()

    server.listen(PORT, () => {
      console.log(`Server chạy tại http://localhost:${PORT}/api-docs/`)
    })
  } catch (err) {
    console.error('DB connect error ❌', err)
    process.exit(1)
  }
}

startServer()
