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
    Category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'blogs',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt'
  }
)

export default Blog
