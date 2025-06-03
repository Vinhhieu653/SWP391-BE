import { DataTypes } from 'sequelize'
import sequelize from '../../database/db.js'

const Blog = sequelize.define(
  'Blog',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'blogs',
    timestamps: true
  }
)

export default Blog
