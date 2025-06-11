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
    vaccines: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    chronicDiseases: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    allergies: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    pastIllnesses: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  },
  {
    tableName: 'Medical_Record',
    timestamps: false
  }
)

export default MedicalRecord
