import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const Image = sequelize.define(
  'Image',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.STRING, allowNull: false },
    public_id: { type: DataTypes.STRING, allowNull: false }
  },
  {
    tableName: 'images',
    timestamps: true
  }
)

export default Image
