import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'postgres',
    logging: false
  }
)

export default sequelize
