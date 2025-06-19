// models/guardian_user.model.js
import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const GuardianUser = sequelize.define(
  'GuardianUser',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    obId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'guardian_users',
    timestamps: true
  }
)

export default GuardianUser
