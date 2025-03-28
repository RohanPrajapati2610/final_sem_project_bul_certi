const Joi = require('joi');

// User validation schemas
const userSchema = {
    create: Joi.object({
        organisationName: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        address: Joi.string().required(),
        adminName: Joi.string().required(),
        adminEmail: Joi.string().email().required(),
        adminPassword: Joi.string().min(6).required(),
    }),
    login: Joi.object({
        adminEmail: Joi.string().email().required(),
        adminPassword: Joi.string().required(),
    }),
    update: Joi.object({
        organisationName: Joi.string(),
        email: Joi.string().email(),
        phone: Joi.string(),
        address: Joi.string(),
        adminName: Joi.string(),
        adminEmail: Joi.string().email(),
    })
};

// Event validation schemas
const eventSchema = {
    create: Joi.object({
        eventName: Joi.string().required(),
        eventDate: Joi.date().required(),
        organizerId: Joi.string().required(),
        description: Joi.string(),
        location: Joi.string(),
    }),
    update: Joi.object({
        eventName: Joi.string(),
        eventDate: Joi.date(),
        description: Joi.string(),
        location: Joi.string(),
    })
};

// Certificate validation schemas
const certificateSchema = {
    create: Joi.object({
        eventId: Joi.string().required(),
        recipientName: Joi.string().required(),
        recipientEmail: Joi.string().email().required(),
        templateId: Joi.string().required(),
    }),
    generateBulk: Joi.object({
        eventId: Joi.string().required(),
        recipients: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
            })
        ).required(),
        templateId: Joi.string().required(),
    }),
    generatePdf: Joi.object({
        eventId: Joi.string().required(),
        recipientName: Joi.string().required(),
        recipientEmail: Joi.string().email().required(),
        templateId: Joi.string().required()
    })
};

// Template validation schemas
const templateSchema = {
    create: Joi.object({
        name: Joi.string().required(),
        orgId: Joi.string().required(),
        content: Joi.string().required(),
        fields: Joi.array().items(Joi.string()),
    }),
    update: Joi.object({
        name: Joi.string(),
        content: Joi.string(),
        fields: Joi.array().items(Joi.string()),
    })
};

// Admin validation schemas
const adminSchema = {
    register: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
    updateProfile: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        currentPassword: Joi.string(),
        newPassword: Joi.string().min(6),
    }),
    toggleStatus: Joi.object({
        isDeleted: Joi.boolean().required()
    })
};

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).send({
                msg: error.details.map(detail => detail.message).join(', '),
                isSuccess: false
            });
        }
        next();
    };
};

module.exports = {
    validate,
    userSchema,
    eventSchema,
    certificateSchema,
    templateSchema,
    adminSchema
};
