// models/cartItem.js
import Sequelize from "sequelize";
import sequelize from "../lib/db.js";
import Cart from "./cart.js";
import Product from "./product.js";

const CartItem = sequelize.define("cartItem", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  cartId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: "carts", key: "id" }
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: { model: "products", key: "id" }
  },
  quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 }
}, { timestamps: false });

CartItem.belongsTo(Cart, { foreignKey: "cartId" });
Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(CartItem, { foreignKey: "productId" });

export default CartItem;
