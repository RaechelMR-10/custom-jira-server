
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
const PriorityLevel = require('./models/PriorityLevel');
const Severity = require('./models/Severity');
const Watcher = require('./models/Watcher');
const AuditTrail= require('./models/AuditTrails');
const Sprint = require('./models/Sprint');
const Documents = require('./models/Documents');
const Recent = require('./models/Recent');

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
const ticketHistoryRouter = require('./routes/tickethistory');
const severityRouter = require('./routes/severity');
const priorityLevelRouter = require('./routes/priorityLevel');
const documentRouter = require('./routes/documents');
const sprintRouter = require('./routes/sprint');
const recentRouter = require('./routes/recent');

const bodyParser = require('body-parser');
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
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const logRequest = (req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
    next();
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // Mount the route handlers
app.use('/', router);
app.use('/user', logRequest, checkToken, userRouter, recentRouter);
app.use('/account',logRequest, authRouter);
app.use('/project', logRequest, checkToken, projectsRouter, statusRouter, typesRouter, severityRouter, priorityLevelRouter, documentRouter, sprintRouter);
app.use('/organization', logRequest, checkToken, organizationRouter);
app.use('/ticket', logRequest, checkToken, ticketsRouter, ticketCommentsRouter, ticketHistoryRouter);
app.use('/project-member', logRequest, checkToken, projectmemberRouter);
  
 
// Error handling middleware
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});
  
app.listen(port, () => {
    console.log('Server running at http://localhost:${port}/');
});