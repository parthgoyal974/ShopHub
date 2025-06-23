// models/order.js
import Sequelize from "sequelize";
import sequelize from "../lib/db.js";
import Users from "./users.js";

const Order = sequelize.define("order", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
  total: { type: Sequelize.FLOAT, allowNull: false },
  status: { type: Sequelize.STRING, allowNull: false, defaultValue: "completed" }
}, { timestamps: true });

Order.belongsTo(Users, { foreignKey: "userId" });
Users.hasMany(Order, { foreignKey: "userId" });

export default Order;
