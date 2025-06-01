import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'
import User from './user.model.js'
import Guardian from './guardian.model.js'

const GuardianUser = sequelize.define(
    'GuardianUser',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        obId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Guardian,
                key: 'obId'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        tableName: 'guardian_users',
        timestamps: false
    }
)

export default GuardianUser
