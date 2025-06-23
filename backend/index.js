import express from 'express';
import cors from 'cors';

import sequelize from './lib/db.js'; 
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';

import Order from './models/order.js';
import OrderItem from './models/orderItem.js';
import Cart from './models/cart.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add static files serving (before routes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));

// Routes
app.use(routes);
app.get('/', (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize DB CONNECTED");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync(); 

    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
})();
