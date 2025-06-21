// models/medical_sent.model.js
import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const MedicalSent = sequelize.define(
  'MedicalSent',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    User_ID: {
      // userId: người gửi hoặc người nhận đơn
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Guardian_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    class: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Image_prescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Medications: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    Delivery_time: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    Notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'MedicalSent',
    timestamps: true
  }
)

export default MedicalSent
