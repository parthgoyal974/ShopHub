import Sequelize from "sequelize";
import sequelize from "../lib/db.js";
import Users from "./users.js";

const Cart = sequelize.define("cart", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    references: { model: "users", key: "id" }
  }
}, { timestamps: false });

Cart.belongsTo(Users, { foreignKey: "userId" });
Users.hasOne(Cart, { foreignKey: "userId" });

export default Cart;

