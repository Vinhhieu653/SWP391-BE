// models/user_event.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../../database/db.js'

const UserEvent = sequelize.define('UserEvent', {
  ueventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'UEvent_ID'
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'Event_ID'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'User_ID'
  }
}, {
  tableName: 'user_event',
  timestamps: false
});

export default UserEvent;
