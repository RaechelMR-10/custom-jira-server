const Users = require('../models/User');
const Organization = require('../models/Organization');
const updateUser = async (id, updateData) => {
    const { first_name,middle_name, last_name, email, username, color, organization_id } = updateData;

    const updateFields = {
        first_name,
        last_name,
        middle_name,
        email,
        username,
        color,
        organization_id
    };

    const updatedUser = await UserModel.findByIdAndUpdate(id, {
        $set: updateFields
    }, { new: true }); 

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

// Function to get all users with pagination
const getAllUsers = async (page, pageSize) => {
    try {
        if (page <= 0 || pageSize <= 0) {
            throw new Error('Page and pageSize must be positive integers.');
        }

        const offset = (page - 1) * pageSize;

        const users = await Users.findAll({
            limit: pageSize,
            offset: offset
        });

        // Apply hideSensitiveData to each user
        const usersWithoutPassword = users.map(hideSensitiveData);

        const totalUsers = await Users.count();

        return {
            users: usersWithoutPassword,
            totalUsers,
            page,
            pageSize,
            totalPages: Math.ceil(totalUsers / pageSize)
        };
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
};

// Function to get all users with pagination
const getAllUsersByOrganizationID = async (organization_id, page, pageSize) => {
    try {
        if (page <= 0 || pageSize <= 0) {
            throw new Error('Page and pageSize must be positive integers.');
        }

        const offset = (page - 1) * pageSize;

        // Fetch users with pagination
        const users = await Users.findAll({
            where: { organization_id: organization_id },
            limit: pageSize,
            offset: offset
        });

        // Apply hideSensitiveData to each user
        const usersWithoutPassword = users.map(hideSensitiveData);

        // Count the total number of users for the given organization_id
        const totalUsers = await Users.count({
            where: { organization_id: organization_id }
        });

        return {
            users: usersWithoutPassword,
            totalUsers,
            page,
            pageSize,
            totalPages: Math.ceil(totalUsers / pageSize)
        };
    } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
    }
};


const deleteUser = async( req, res) =>{
    try{
        const { id } = req.params;
        const deleted = await Users.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
}

const hideSensitiveData = (user) => {
    const userObj = user.toJSON ? user.toJSON() : user;
    const { password, ...userWithoutPassword } = userObj;
    return userWithoutPassword;
};



module.exports = {
    updateUser,
    getUser,
    getAllUsers,
    deleteUser,
    getAllUsersByOrganizationID
};
