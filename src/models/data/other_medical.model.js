// models/OtherMedical.js

import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const OtherMedical = sequelize.define(
  'OtherMedical',
  {
    OrtherM_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Event_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Decription: {
      type: DataTypes.TEXT
    },
    Image: {
      type: DataTypes.TEXT
    },
    Is_calLOb: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    tableName: 'Other_medical',
    timestamps: false
  }
)

export default OtherMedical
