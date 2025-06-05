import Sequelize from "sequelize";
import sequelize from "../lib/db.js";
import Category from "./category.js";
import Subcategory from "./subCategory.js";


const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rating: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "categories",
      key: "id"
    }
  },
  subcategoryId: {
  type: Sequelize.INTEGER,
  allowNull: true,
  references: {
    model: "subcategories",
    key: "id"
  }
}

}, { timestamps: false });

// Association
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Subcategory, { foreignKey: "subcategoryId" });
Subcategory.hasMany(Product, { foreignKey: "subcategoryId" });
export default Product;
