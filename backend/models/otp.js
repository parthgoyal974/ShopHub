import Sequelize from "sequelize";
import sequelize from "../lib/db.js";

const OTP = sequelize.define("otp", {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: Sequelize.STRING, allowNull: false },
  otp: { type: Sequelize.STRING, allowNull: false },
  expiresAt: { type: Sequelize.DATE, allowNull: false }
}, { timestamps: true });

export default OTP;
