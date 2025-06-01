// models/FormCheck.js

import { DataTypes } from 'sequelize';
import sequelize from '../../database/db.js';

const FormCheck = sequelize.define('FormCheck', {
    Form_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    HC_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Height: {
        type: DataTypes.INTEGER,
    },
    Weight: {
        type: DataTypes.FLOAT,
    },
    Blood_Pressure: {
        type: DataTypes.FLOAT,
    },
    Vision_Left: {
        type: DataTypes.INTEGER,
    },
    Vision_Right: {
        type: DataTypes.INTEGER,
    },
    Dental_Status: {
        type: DataTypes.STRING,
    },
    ENT_Status: {
        type: DataTypes.STRING,
    },
    Skin_Status: {
        type: DataTypes.STRING,
    },
    General_Conclusion: {
        type: DataTypes.TEXT,
    },
    Is_need_meet: {
        type: DataTypes.BOOLEAN,
    },
}, {
    tableName: 'Form_Check',
    timestamps: false,
});

export default FormCheck;
