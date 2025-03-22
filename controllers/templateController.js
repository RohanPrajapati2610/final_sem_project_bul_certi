const mongoose = require('mongoose');
const Template = require('../models/templateModel');

// Create a new template
const createTemplate = async (req, res) => {
    try {
        const template = new Template({
            name: req.body.name,
            orgId: req.body.orgId,
            backgroundImage: req.body.backgroundImage,
            html: req.body.html,
            isDefault: req.body.isDefault || false
        });

        await template.save();
        res.send({
            msg: "Template created successfully",
            isSuccess: true,
            data: template
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error creating template",
            isSuccess: false,
            error: error.message
        });
    }
};

// Get all templates for an organization
const getTemplatesByOrg = async (req, res) => {
    try {
        const orgId = req.params.orgId;
        const templates = await Template.find({ 
            orgId: orgId,
            isDeleted: false
        });

        if (templates.length === 0) {
            return res.send({
                msg: "No templates found for this organization",
                isSuccess: false
            });
        }

        res.send({
            msg: "Templates fetched successfully",
            isSuccess: true,
            data: templates
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error fetching templates",
            isSuccess: false,
            error: error.message
        });
    }
};

// Get a template by ID
const getTemplateById = async (req, res) => {
    try {
        const templateId = req.params.id;
        const template = await Template.findById(templateId);

        if (!template || template.isDeleted) {
            return res.send({
                msg: "Template not found",
                isSuccess: false
            });
        }

        res.send({
            msg: "Template fetched successfully",
            isSuccess: true,
            data: template
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error fetching template",
            isSuccess: false,
            error: error.message
        });
    }
};

// Update a template
const updateTemplate = async (req, res) => {
    try {
        const templateId = req.params.id;
        const updates = {
            name: req.body.name,
            backgroundImage: req.body.backgroundImage,
            html: req.body.html,
            isDefault: req.body.isDefault
        };

        // Remove undefined values
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const template = await Template.findByIdAndUpdate(
            templateId,
            updates,
            { new: true }
        );

        if (!template) {
            return res.send({
                msg: "Template not found",
                isSuccess: false
            });
        }

        res.send({
            msg: "Template updated successfully",
            isSuccess: true,
            data: template
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error updating template",
            isSuccess: false,
            error: error.message
        });
    }
};

// Delete a template (soft delete)
const deleteTemplate = async (req, res) => {
    try {
        const templateId = req.params.id;
        const template = await Template.findByIdAndUpdate(
            templateId,
            { isDeleted: true },
            { new: true }
        );

        if (!template) {
            return res.send({
                msg: "Template not found",
                isSuccess: false
            });
        }

        res.send({
            msg: "Template deleted successfully",
            isSuccess: true
        });
    } catch (error) {
        console.log(error);
        res.send({
            msg: "Error deleting template",
            isSuccess: false,
            error: error.message
        });
    }
};

module.exports = {
    createTemplate,
    getTemplatesByOrg,
    getTemplateById,
    updateTemplate,
    deleteTemplate
}; 