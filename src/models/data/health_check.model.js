import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const HealthCheck = sequelize.define(
  'HealthCheck',
  {
    HC_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Event_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    School_year: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Health_check',
    timestamps: true
  }
)

export default HealthCheck
