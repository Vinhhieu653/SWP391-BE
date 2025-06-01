import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const MedicalSent = sequelize.define('MedicalSent', {
    ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    OM_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Sent_by: {
        type: DataTypes.STRING,
    },
    Image_prescription: {
        type: DataTypes.TEXT,
    },
    Date_sent: {
        type: DataTypes.DATE,
    },
    Is_confirm: {
        type: DataTypes.BOOLEAN,
    },
}, {
    tableName: 'MedicalSent',
    timestamps: false,
});

export default MedicalSent;
