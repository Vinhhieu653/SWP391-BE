import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const Notification = sequelize.define(
  'Notification',
  {
    notiId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mess: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'noti',
    timestamps: true
  }
)

export default Notification
