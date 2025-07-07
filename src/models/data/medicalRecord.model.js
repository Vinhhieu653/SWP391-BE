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
    Class: {
      type: DataTypes.STRING,
      allowNull: true
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    bloodType: {
      type: DataTypes.STRING
    },
    chronicDiseases: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pastIllnesses: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'Medical_Record',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt'
  }
)

export default MedicalRecord
