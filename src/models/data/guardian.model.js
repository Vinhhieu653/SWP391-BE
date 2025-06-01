import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'
import GuardianUser from './guardian_user.model.js'

const Guardian = sequelize.define(
  'Guardian',
  {
    obId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    roleInFamily: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isCallFirst: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    tableName: 'guardians',
    timestamps: false
  }
)

export default Guardian
