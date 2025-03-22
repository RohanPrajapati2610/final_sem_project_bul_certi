const mongoose = require('mongoose');
const Admin = require('../models/adminModel');
const User = require('../models/userModel');

// Admin Registration
const registerAdmin = async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ email: req.body.email });
        if (existingAdmin) {
            return res.send({
                msg: "Admin with this email already exists",
                isSuccess: false
            });
        }

        const admin = new Admin({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'ADMIN'
        });

        await admin.save();
        res.send({
            msg: "Admin registered successfully",
            isSuccess: true,
            data: admin
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error registering admin",
            isSuccess: false,
            error: error.message
        });
    }
};

// Admin Login
const loginAdmin = async (req, res) => {
    try {
        const admin = await Admin.findOne({ 
            email: req.body.email,
            isDeleted: false
        });

        if (!admin) {
            return res.send({
                msg: "Admin not found",
                isSuccess: false
            });
        }

        if (req.body.password !== admin.password) {
            return res.send({
                msg: "Invalid password",
                isSuccess: false
            });
        }

        res.send({
            msg: "Admin login successful",
            isSuccess: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error logging in",
            isSuccess: false,
            error: error.message
        });
    }
};

// Get all organizations for admin
const getAllOrganizations = async (req, res) => {
    try {
        const organizations = await User.find({ isDeleted: false });

        res.send({
            msg: "Organizations fetched successfully",
            isSuccess: true,
            data: organizations
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error fetching organizations",
            isSuccess: false,
            error: error.message
        });
    }
};

// Block/Unblock an organization
const toggleOrganizationStatus = async (req, res) => {
    try {
        const orgId = req.params.id;
        const status = req.body.isDeleted;

        if (status === undefined) {
            return res.send({
                msg: "Status is required",
                isSuccess: false
            });
        }

        const organization = await User.findByIdAndUpdate(
            orgId,
            { isDeleted: status },
            { new: true }
        );

        if (!organization) {
            return res.send({
                msg: "Organization not found",
                isSuccess: false
            });
        }

        const actionText = status ? "blocked" : "unblocked";
        res.send({
            msg: `Organization ${actionText} successfully`,
            isSuccess: true,
            data: organization
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error updating organization status",
            isSuccess: false,
            error: error.message
        });
    }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
    try {
        const adminId = req.params.id;
        const admin = await Admin.findById(adminId);

        if (!admin || admin.isDeleted) {
            return res.send({
                msg: "Admin not found",
                isSuccess: false
            });
        }

        res.send({
            msg: "Admin profile fetched successfully",
            isSuccess: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error fetching admin profile",
            isSuccess: false,
            error: error.message
        });
    }
};

// Update admin profile
const updateAdminProfile = async (req, res) => {
    try {
        const adminId = req.params.id;
        const updates = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };

        // Remove undefined values
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const admin = await Admin.findByIdAndUpdate(
            adminId,
            updates,
            { new: true }
        );

        if (!admin) {
            return res.send({
                msg: "Admin not found",
                isSuccess: false
            });
        }

        res.send({
            msg: "Admin profile updated successfully",
            isSuccess: true,
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error updating admin profile",
            isSuccess: false,
            error: error.message
        });
    }
};

module.exports = {
    registerAdmin,
    loginAdmin,
    getAllOrganizations,
    toggleOrganizationStatus,
    getAdminProfile,
    updateAdminProfile
}; 