import express from 'express';
import cors from 'cors';

import sequelize from './lib/db.js'; 
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/index.js';
import adminRoutes from './admin/routes/adminRoutes.js';
import methodOverride from 'method-override';
dotenv.config();
import Users from './models/users.js';
import UnverifiedUsers from './models/unverifiedUsers.js';
const app = express();
import session from 'express-session';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.ADMIN_SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));

// Optional: Extend session on each request (rolling session)
app.use((req, res, next) => {
  if (req.session) {
    req.session._garbage = Date();
    req.session.touch();
  }
  next();
});

// Create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(methodOverride('_method'));


// Add static files serving (before routes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
  }
}));
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory for EJS templates
app.set('views', path.join(__dirname, 'admin', 'views'));
// Routes
app.use(routes);
app.use('/admin', adminRoutes);
app.get('/', (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize DB CONNECTED");
    await sequelize.sync(); 
    

    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB:", error);
  }
})();
