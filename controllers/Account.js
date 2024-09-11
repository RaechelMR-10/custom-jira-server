const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET= process.env.jwt_secret_token;



const signup = async (req, res) => {
    try {
        const { first_name, last_name, email, username, password, organization_id } = req.body;

        const user = await Users.create({ first_name, last_name, email, username, password, organization_id });
        
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user', details: error.message });
    }
};

const auth = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await Users.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.id, guid: user.guid }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in', details: error.message });
    }
};

module.exports = { signup, auth };