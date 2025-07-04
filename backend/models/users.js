import Sequelize from "sequelize";
import sequelize from "../lib/db.js";

const Users = sequelize.define("users", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: "username_unique" // Named unique constraint
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: "email_unique" // Named unique constraint
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    isAdmin: {
       type: Sequelize.BOOLEAN,
       allowNull: false,
       defaultValue: false
   }
}, {
    timestamps: true, // Enable timestamps
    createdAt: 'createdAt', // Map to existing column
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ['username'],
            name: 'username_unique'
        },
        {
            unique: true,
            fields: ['email'],
            name: 'email_unique'
        }
    ]
});

export default Users;
