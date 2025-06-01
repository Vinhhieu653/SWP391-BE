// models/event.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../../database/db.js'

const Event = sequelize.define('Event', {
    eventId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'Event_ID'
    },
    dateEvent: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'Date_event'
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'Type'
    }
}, {
    tableName: 'event',
    timestamps: false
});

export default Event;
