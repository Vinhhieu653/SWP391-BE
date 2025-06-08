// models/form_check.model.js
import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const FormCheck = sequelize.define(
  'FormCheck',
  {
    Form_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    HC_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Student_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Height: DataTypes.INTEGER,
    Weight: DataTypes.FLOAT,
    Blood_Pressure: DataTypes.STRING,
    Vision_Left: DataTypes.FLOAT,
    Vision_Right: DataTypes.FLOAT,
    Dental_Status: DataTypes.STRING,
    ENT_Status: DataTypes.STRING,
    Skin_Status: DataTypes.STRING,
    General_Conclusion: DataTypes.TEXT,
    Is_need_meet: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Is_confirmed_by_guardian: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'Form_Check',
    timestamps: false
  }
)

export default FormCheck
