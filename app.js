const express = require('express');
const { sequelize } = require('./models'); // Import sequelize instance from models
const app = express();

// Sync database and start server
sequelize.sync({ force: false }) // Use force: true in development to drop and recreate tables
    .then(() => {
        console.log('Database synced successfully');

        // Start Express server only after the database is synced
        app.listen(3000, () => {
            console.log('Server running at http://127.0.0.1:3000/');
        });
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

app.get('/', (req, res) => {
  res.status(200).send('Hello, World!\n');
});
