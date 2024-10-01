
const rateLimit = require('express-rate-limit');

const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests to /user, please try again later.',
});

const projectLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 20000, 
  message: 'Too many requests to /project, please try again later.',
});


const accountLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests to /account, please try again later.',
});

const organizationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: 'Too many requests to /organization, please try again later.',
});

const ticketLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: 'Too many requests to /ticket, please try again later.',
});

const projectMemberLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  message: 'Too many requests to /project-member, please try again later.',
});

module.exports = {
  userLimiter,
  projectLimiter,
  accountLimiter,
  organizationLimiter,
  ticketLimiter,
  projectMemberLimiter,
};
