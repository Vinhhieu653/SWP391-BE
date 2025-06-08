import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const MedicalRecord = sequelize.define(
  'Medical_Record',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    class:{
      type: DataTypes.STRING,
      allowNull: false
    },
    historyHealth: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  },
  {
    tableName: 'Medical_Record',
    timestamps: false
  }
)

export default MedicalRecord
