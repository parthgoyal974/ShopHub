import Sequelize from "sequelize";
import sequelize from "../lib/db.js";

const Category = sequelize.define("category", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  }
}, { timestamps: false });

export default Category;
