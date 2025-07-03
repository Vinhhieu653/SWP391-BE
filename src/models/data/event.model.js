import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const Event = sequelize.define(
  'Event',
  {
    eventId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dateEvent: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'Event',
    timestamps: true,
    paranoid: true, // 👈 THÊM VÔ
    deletedAt: 'deletedAt'
  }
)

export default Event
