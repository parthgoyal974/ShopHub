import Sequelize from "sequelize";
import sequelize from "../lib/db.js";
import Product from "./product.js";
import User from "./users.js";

const Review = sequelize.define("review", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: "products", key: "id" }
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: "users", key: "id" }
  },
  rating: {
    type: Sequelize.FLOAT,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  comment: {
    type: Sequelize.TEXT,
    allowNull: true
  }
}, { timestamps: true });

// Associations
Review.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Review, { foreignKey: "productId" });

Review.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId" });

export default Review;
