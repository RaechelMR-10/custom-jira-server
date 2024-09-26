const Users = require('../models/User');
const Organization = require('../models/Organization');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { organization } = require('../routes');
const ProjectMember = require('../models/ProjectMember')
const JWT_SECRET= process.env.jwt_secret_token;

const signup = async (req, res) => {
    try {
        const { first_name, middle_name, last_name, email, username, password, organization_id, color} = req.body;

        let orgId = organization_id;
        let roles = 'member';
        
        if (!organization_id) {
            const newOrganization = await Organization.create({
                name: 'Temporary Name',
                description: 'Temporary Description',
                subscription_type: null,
                subscription_StartDate: null,
                subscription_EndDate: null,
                isActive: false,
                image: null
            });
            orgId = newOrganization.id;
            roles = 'admin'
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with the organization ID
        const user = await Users.create({
            first_name,
            last_name,
            middle_name,
            email,
            username,
            password: hashedPassword,
            role: roles,
            organization_id: orgId, 
            color: color || '#878787' , 
            isActive: true,
            user_image: null
        });

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user', details: error.message });
    }
};

// const auth = async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Find the user by username
//         const user = await Users.findOne({ where: { username } });
//         if (!user) {
//             console.log('User not found');
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }

//         // Check if the account is inactive
//         if (!user.isActive) {
//             console.log('Account is inactive');
//             return res.status(403).json({ error: 'Account is inactive' });
//         }

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log('Password comparison result:', isMatch);

//         if (!isMatch) {
//             return res.status(401).json({ error: 'Invalid credentials' });
//         }
        
//         // Generate JWT token
//         const token = jwt.sign(
//             { id: user.id, guid: user.guid },
//             JWT_SECRET,
//             { expiresIn: '7d' }
//         );
        

//         // Exclude password from user data
//         const userJson = user.toJSON ? user.toJSON() : user;
//         const { password: _, organization_id, ...userData } = userJson;

//         let organization = null;
//         if (organization_id) {
//             organization = await Organization.findByPk(organization_id);
//             if (organization) {
//                 organization = organization.toJSON(); // Convert to JSON if needed
//             }
//         }

//         // Merge organization data into user data if organization exists
//         if (organization) {
//             userData.organization = organization;
//         }

//         // Send success response with user and possibly organization data
//         res.status(200).json({ message: 'Login successful', token, user: userData });
//     } catch (error) {
//         res.status(500).json({ error: 'Error logging in', details: error.message });
//     }
// };

// const forChecking = async (req, res)=>{

//     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsImd1aWQiOiI2YjYyOWFlNy1lZjZkLTRiYmUtOWM0YS0wMjVmODk4NWFjOGUiLCJyb2xlcyI6eyJvcmdhbml6YXRpb25Sb2xlIjoibWVtYmVyIiwicHJvamVjdFJvbGVzIjp7IjIzIjp7InJvbGUiOiJtYW5hZ2VyIiwicHJvamVjdE5hbWUiOm51bGx9LCIzMCI6eyJyb2xlIjoibWFuYWdlciIsInByb2plY3ROYW1lIjpudWxsfSwiNDQiOnsicm9sZSI6Im1hbmFnZXIiLCJwcm9qZWN0TmFtZSI6bnVsbH19fSwiaWF0IjoxNzI3MzY0MzczLCJleHAiOjE3Mjc5NjkxNzN9.aorx4VM8Oa71U7pgcd8Ww_pjkMo_DXVyoU3lWEPrSk0";

//     // Decode the JWT (without verifying)
//     const decoded = jwt.decode(token);

//     if (decoded && decoded.roles && decoded.roles.organizationRole === 'admin') {
//         console.log('User is an admin');
//     } else {
//         console.log('User is not an admin');
//     }
// }

const forChecking = (req, res) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTgsImd1aWQiOiI2YjYyOWFlNy1lZjZkLTRiYmUtOWM0YS0wMjVmODk4NWFjOGUiLCJyb2xlcyI6eyJvcmdhbml6YXRpb25Sb2xlIjoibWVtYmVyIiwicHJvamVjdFJvbGVzIjp7IjIzIjp7InJvbGUiOiJtYW5hZ2VyIiwicHJvamVjdE5hbWUiOm51bGx9LCIzMCI6eyJyb2xlIjoibWFuYWdlciIsInByb2plY3ROYW1lIjpudWxsfSwiNDQiOnsicm9sZSI6Im1hbmFnZXIiLCJwcm9qZWN0TmFtZSI6bnVsbH19fSwiaWF0IjoxNzI3MzY0MzczLCJleHAiOjE3Mjc5NjkxNzN9.aorx4VM8Oa71U7pgcd8Ww_pjkMo_DXVyoU3lWEPrSk0" // Retrieve token from the 'Authorization' header

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Decode the JWT (without verifying)
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.roles) {
        return res.status(403).json({ error: 'Invalid or malformed token' });
    }

    // Check organization role
    const organizationRole = decoded.roles.organizationRole;
    if (organizationRole === 'admin') {
        console.log('User is an organization admin');
    } else {
        console.log('User is not an organization admin');
    }

    // Check project roles
    const projectRoles = decoded.roles.projectRoles;
    if (projectRoles) {
        for (const [projectId, roleDetails] of Object.entries(projectRoles)) {
            const { role } = roleDetails;
            console.log(`User has the role of ${role} for project ID ${projectId}`);
        }
    } else {
        console.log('User has no project-specific roles');
    }
};

const auth = async (req, res) => {
    try {
        const { username, password } = req.body;
        forChecking()
        // Find the user by username
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the account is inactive
        if (!user.isActive) {
            return res.status(403).json({ error: 'Account is inactive' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Get organization role from the User model
        const organizationRole = user.role;

        // Retrieve all project roles for the user
        const projectRoles = await ProjectMember.findAll({
            where: { user_id: user.id },
            attributes: ['project_id', 'role']
        });

        // Construct an object to store project roles by project ID or name
        const projectRoleMap = projectRoles.reduce((acc, projectRole) => {
            acc[projectRole.project_id] = {
                role: projectRole.role,
                projectName: projectRole.Project ? projectRole.Project.name : null,
            };
            return acc;
        }, {});

        // Generate JWT token with roles in payload
        const token = jwt.sign(
            {
                id: user.id,
                guid: user.guid,
                roles: {
                    organizationRole,  // Include organization role
                    projectRoles: projectRoleMap // Include project roles mapped by project ID
                },
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Exclude password from user data
        const { password: _, organization_id, ...userData } = user.toJSON();

        let organization = null;
        if (organization_id) {
            organization = await Organization.findByPk(organization_id);
            if (organization) {
                organization = organization.toJSON();
            }
        }

        // Merge organization data into user data if organization exists
        if (organization) {
            userData.organization = organization;
        }

        // Send success response with user data (exclude role info)
        res.status(200).json({ message: 'Login successful', token, user: userData });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
};


const checkToken = (req, res, next) => {
    console.log('Checking token...');
    

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Authorization Header:', authHeader);
    console.log('Extracted Token:', token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err.message);
            return res.status(403).json({ error: 'Token is invalid or expired' });
        }

        const now = Math.floor(Date.now() / 1000);
        const remainingTime = decoded.exp - now;

        if (remainingTime <= 0) {
            console.log('Token has expired');
            return res.status(403).json({ error: 'Token has expired' });
        }

        console.log('Token is valid. User:', decoded);
        req.user = decoded;
        req.tokenRemainingTime = remainingTime;

        next();
    });
};



module.exports = { signup, auth, checkToken };