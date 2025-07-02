// models/VaccineHistory.js

import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const VaccineHistory = sequelize.define(
  'VaccineHistory',
  {
    VH_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Event_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Vaccine_name: {
      type: DataTypes.STRING
    },
    Vaccince_type: {
      type: DataTypes.STRING
    },
    Date_injection: {
      type: DataTypes.DATE
    },
    note_affter_injection: {
      type: DataTypes.STRING
    },
    Status: {
      type: DataTypes.STRING,
      defaultValue: 'Chờ xác nhận'
    },
    Is_created_by_guardian: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },
  {
    tableName: 'Vaccine_History',
    timestamps: false
  }
)

export default VaccineHistory
