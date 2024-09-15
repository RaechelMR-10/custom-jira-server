const Users = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET= process.env.jwt_secret_token;

const signup = async (req, res) => {
    try {
        const { first_name, last_name, email, username, password, organization_id, color } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({
            first_name,
            last_name,
            email,
            username,
            password: hashedPassword,
            organization_id,
            color: color || '#878787'  // Default to '#878787' if no color is provided
        });
        
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error('Error creating user:', error); 
        res.status(500).json({ error: 'Error creating user', details: error.message });
    }
};


const auth = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign({ id: user.id, guid: user.guid }, JWT_SECRET, { expiresIn: '1h' });

        // Exclude password from user data
        const userJson = user.toJSON ? user.toJSON() : user;
        const { password: _, ...userData } = userJson;

        // Send success response
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