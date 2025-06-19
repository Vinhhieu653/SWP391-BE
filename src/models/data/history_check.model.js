// models/HistoryCheck.js

import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const HistoryCheck = sequelize.define(
  'HistoryCheck',
  {
    HisC_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    HC_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    MR_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Date_create: {
      type: DataTypes.DATE,
      allowNull: false
    }
  },
  {
    tableName: 'History_check',
    timestamps: true
  }
)

export default HistoryCheck
