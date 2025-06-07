// models/Category.js
import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const Category = sequelize.define(
  'Category',
  {
    Category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    Created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'Category',
    timestamps: false
  }
)

export default Category
