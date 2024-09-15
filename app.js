
require('dotenv').config();
const express = require('express')
const session = require('express-session');
const sequelize = require('./config/database');
const User = require('./models/User');
const Organization = require('./models/Organization');
const Status = require('./models/Status');
const Tickets = require('./models/Tickets');
const TicketHistory = require('./models/TicketHistory');
const TicketComments = require('./models/TicketComments');
const Types = require('./models/Types');
const Projects = require('./models/Projects');

const tediousConnection = require('./config/tediousconn'); 
const router = express.Router();
const userRouter = require('./routes/user')
const authRouter = require('./routes/account')
const projectsRouter = require('./routes/project');
const statusRouter = require('./routes/status');
const organizationRouter = require('./routes/organization');
const typesRouter = require('./routes/types');
const ticketCommentsRouter = require('./routes/ticketcomments'); 
const ticketsRouter = require('./routes/tickets'); 
const ticketHistoryRouter = require('./routes/tickethistory')
const app = express();
const port = 3001
// Sync models with the database
//sequelize.sync({ alter: true }) 

app.use(session({
    secret: process.env.jwt_secret_token, 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
      secure: false, 
      httpOnly: true,
      maxAge: null 
    },
  }));
  
  // Add middleware to parse JSON bodies
  app.use(express.json());
  
  // Mount the route handlers
  app.use('/', router);
  app.use('/user', (req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
}, userRouter);
  app.use('/account', (req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    console.log('Request Body:', req.body);
    next();
}, authRouter);
  app.use('/project', projectsRouter, statusRouter, typesRouter);
  app.use('/organization', organizationRouter);
  app.use('/ticket', ticketsRouter, ticketCommentsRouter, ticketHistoryRouter);

  

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
  
app.listen(port, () => {
    console.log('Server running at http://localhost:${port}/');
});