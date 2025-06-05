import Sequelize from "sequelize";
import sequelize from "../lib/db.js";
import Category from "./category.js";

const Subcategory = sequelize.define("subcategory", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  parentId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id"
    }
  }
}, { timestamps: false });

// Associations
Subcategory.belongsTo(Category, { foreignKey: "parentId" });
Category.hasMany(Subcategory, { foreignKey: "parentId" });

export default Subcategory;
