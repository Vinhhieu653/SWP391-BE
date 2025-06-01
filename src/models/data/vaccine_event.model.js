// models/VaccineEvent.js

import { DataTypes } from 'sequelize';
import sequelize from '../../database/db.js';

const VaccineEvent = sequelize.define('VaccineEvent', {
    VE_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Even_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    follow_up: {
        type: DataTypes.TEXT,
    },
}, {
    tableName: 'Vaccine_event',
    timestamps: false,
});

export default VaccineEvent;
