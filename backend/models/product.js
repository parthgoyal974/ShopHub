import Sequelize from "sequelize";
import sequelize from "../lib/db.js";
import Category from "./category.js";

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
  }
}, { timestamps: false });

// Association
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId" });

export default Product;
