
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
const ProjectMember = require('./models/ProjectMember');

const tediousConnection = require('./config/tediousconn'); 
const router = express.Router();
const cors = require('cors');
const path = require('path'); 
const userRouter = require('./routes/user')
const authRouter = require('./routes/account')
const projectsRouter = require('./routes/project');
const statusRouter = require('./routes/status');
const organizationRouter = require('./routes/organization');
const projectmemberRouter= require('./routes/projectmember');
const typesRouter = require('./routes/types');
const ticketCommentsRouter = require('./routes/ticketcomments'); 
const ticketsRouter = require('./routes/tickets'); 
const ticketHistoryRouter = require('./routes/tickethistory')
const { checkToken } = require('./controllers/Account');
const app = express();
const port = 3001
// Sync models with the database
sequelize.sync({ alter: true }) 
app.use(cors());
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
  
const logRequest = (req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Mount the route handlers
app.use('/', router);
app.use('/user', logRequest, userRouter);
app.use('/account',logRequest, authRouter);
app.use('/project', logRequest, projectsRouter, statusRouter, typesRouter);
app.use('/organization', logRequest, organizationRouter);
app.use('/ticket', logRequest, ticketsRouter, ticketCommentsRouter, ticketHistoryRouter);
app.use('/project-member', logRequest, projectmemberRouter);
  
 
// Error handling middleware
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
  
app.listen(port, () => {
    console.log('Server running at http://localhost:${port}/');
});