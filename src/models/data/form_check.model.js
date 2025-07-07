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
    image: {
      type: DataTypes.STRING,
      allowNull: true
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
    status: {
      type: DataTypes.ENUM('created', 'pending', 'approved', 'rejected', 'checked'),
      defaultValue: 'created'
    },
    Created_By: {
      type: DataTypes.INTEGER,
      allowNull: true // chưa nhập thì null
    }
  },
  {
    tableName: 'Form_Check',
    timestamps: true
  }
)

export default FormCheck
