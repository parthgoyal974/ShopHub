import Sequelize from "sequelize";
import sequelize from "../lib/db.js";

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
    category: { 
    type: Sequelize.STRING,
    allowNull: false
  }
}, { timestamps: false });

export default Product;
