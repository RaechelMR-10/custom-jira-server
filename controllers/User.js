const Users = require('../models/User');
const bcrypt = require('bcrypt');

const updateUser = async (id, updateData) => {
    const { first_name, last_name, email, username, password, color, organization_id } = updateData;

    const updateFields = {
        first_name,
        last_name,
        email,
        username,
        color,
        organization_id
    };

    if (password) {
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        updateFields.password = hashedPassword;
    }

    // Perform the update operation
    const updatedUser = await UserModel.findByIdAndUpdate(id, {
        $set: updateFields
    }, { new: true }); // Option to return the updated document

    if (!updatedUser) {
        throw new Error('User not found');
    }

    return updatedUser;
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


const getAllUsers = async (page, pageSize) => {
    try {
        // Validate that page and pageSize are positive integers
        if (page <= 0 || pageSize <= 0) {
            throw new Error('Page and pageSize must be positive integers.');
        }

        // Calculate the offset based on the page and pageSize
        const offset = (page - 1) * pageSize;

        // Fetch users with pagination
        const users = await Users.findAll({
            limit: pageSize,
            offset: offset
        });

        // Get total count of users
        const totalUsers = await Users.count();

        // Map users to hide sensitive data
        return {
            users: users.map(hideSensitiveData),
            totalUsers,
            page,
            pageSize,
            totalPages: Math.ceil(totalUsers / pageSize)
        };
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
