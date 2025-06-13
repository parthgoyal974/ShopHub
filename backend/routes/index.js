import fs from 'fs';
import path from 'path';
import express from 'express';

const router = express.Router();
const __dirname = path.resolve();

// Get all .js files in the routes directory except index.js
fs.readdirSync(__dirname + '/routes').forEach(file => {
  if (
    file.endsWith('.js') &&
    file !== 'index.js'
  ) {
    // Remove the .js extension for the route path
    const routePath = '/api/' + file.replace('Routes.js', '').replace('.js', '');
    // Import the router
    import(`./${file}`).then(module => {
      // Mount the router
      router.use(routePath, module.default);
    });
  }
});

export default router;
