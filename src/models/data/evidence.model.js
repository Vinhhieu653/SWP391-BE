// models/Evidence.js

import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const Evidence = sequelize.define(
  'Evidence',
  {
    Evidence_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    VH_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Image: {
      type: DataTypes.TEXT
    }
  },
  {
    tableName: 'Evidence',
    timestamps: false
  }
)

export default Evidence
