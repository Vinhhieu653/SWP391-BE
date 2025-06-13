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
    MR_ID: {
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
    Is_confirmed: {
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
