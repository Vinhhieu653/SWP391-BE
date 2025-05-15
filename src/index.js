import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import sequelize from './database/db.js'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './configs/swagger.js'
import testRoute from './routes/test.route.js'
import errorHandler from './middlewares/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(errorHandler)

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(testRoute)

app.get('/', (req, res) => res.send('API is running...'))

// Connect DB and start server
async function startServer() {
  try {
    await sequelize.authenticate()
    console.log('PostgreSQL connected ✅')

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('DB connect error ❌', err)
    process.exit(1) // thoát app nếu DB lỗi
  }
}

startServer()
