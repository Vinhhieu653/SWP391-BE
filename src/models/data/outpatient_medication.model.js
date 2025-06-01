import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const OutpatientMedication = sequelize.define(
  'Outpatient_medication',
  {
    OM_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    MR_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'Outpatient_medication',
    timestamps: false
  }
)

export default OutpatientMedication
