// models/role.model.js
import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const Role = sequelize.define(
  'Role',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'roles',
    timestamps: false
  }
)

export default Role
