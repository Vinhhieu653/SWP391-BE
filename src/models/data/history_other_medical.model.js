import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const HistoryOtherMedical = sequelize.define(
  'History_Other_medical',
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    OrtherM_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Date_create: {
      type: DataTypes.DATE
    },
    Creater_by: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'History_Other_medical',
    timestamps: true
  }
)

export default HistoryOtherMedical
