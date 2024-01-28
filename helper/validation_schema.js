
const Joi = require('joi').extend(require('@joi/date'));

const employeeSchema = Joi.object({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
    email: Joi.string().email().lowercase().required(),
    birthday: Joi.date().format('MM/DD/YYYY').raw(),
    jobTitle: Joi.string().required(),
    department: Joi.string().required()
});

const materialSchema = Joi.object({
    ISBN: Joi.string().length(13).pattern(/^[0-9]+$/).required(),
    format: Joi.string().min(2).required(),
    author: Joi.string().min(2).required(),
    title: Joi.string().min(3).required(),
    audience: Joi.string().min(4).required(),
    publicationDate: Joi.date().format('YYYY').raw(),
    summary: Joi.string().min(10).required(),
    language: Joi.string().min(4).required(),
    subject: Joi.string().min(5).required(),
    rentalTimeInWeeks: Joi.string().length(1).pattern(/^[1-4]+$/).required()
});


module.exports = {
    materialSchema,
    employeeSchema
    
}