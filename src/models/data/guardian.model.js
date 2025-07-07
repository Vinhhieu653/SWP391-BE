// models/guardian.model.js
import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

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
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isCallFirst: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false
    }
  },
  {
    tableName: 'guardians',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt'
  }
)

export default Guardian
