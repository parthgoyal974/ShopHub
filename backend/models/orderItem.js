// models/orderItem.js
import Sequelize from "sequelize";
import sequelize from "../lib/db.js";
import Order from "./order.js";
import Product from "./product.js";

const OrderItem = sequelize.define("orderItem", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  orderId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "orders", key: "id" } },
  productId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "products", key: "id" } },
  quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
  price: { type: Sequelize.FLOAT, allowNull: false }
}, { timestamps: false });

OrderItem.belongsTo(Order, { foreignKey: "orderId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });

export default OrderItem;
