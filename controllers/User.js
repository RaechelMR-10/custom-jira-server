const Users = require('../models/User');

const updateUser = async (id, updateData) => {
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        await user.update(updateData);
        return user;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};

const getUser = async (id) => {
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }
        return hideSensitiveData(user);
    } catch (error) {
        throw new Error(`Error getting user: ${error.message}`);
    }
};

const getAllUsers = async () => {
    try {
        const users = await Users.findAll();
        return users.map(hideSensitiveData);
    } catch (error) {
        throw new Error(`Error getting users: ${error.message}`);
    }
};


const hideSensitiveData = (user) => {
    const { password, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
};


module.exports = {
    updateUser,
    getUser,
    getAllUsers
};
