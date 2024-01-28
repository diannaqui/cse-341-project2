const mongodb = require('../db/connect');
const createError = require('http-errors');

const ObjectId = require('mongodb').ObjectId;
const { employeeSchema } = require('../helper/validation_schema');

const getAll = async (req, res, next) => {
  /**
   * #swagger.tags = ['Employees']
   * #swagger.summary = "List all the employees"
  */
  
  try {
    const result = await mongodb.getDb().db().collection('employees').find();
    result.toArray().then((lists) => {
      if (lists.length == 0) {
        res.status(404).send(createError('There are no registered employees'));
        return;
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });

  } catch (err) {
    next (err);
  }
};


const getSingle = async (req, res, next) => {
  /**
   * #swagger.tags = ['Employees']
   * #swagger.summary = "Get the employee by ID"
   * #swagger.description = "Enter the Employee ID."
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid employee ID to find an employee.')
    }

    const employeeId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('employees').find({ _id: employeeId });

    result.toArray().then((lists) => {
        if (lists.length == 0) {
          res.status(404).send(createError('The employee with that ID does not exist.'));
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
  } catch (err) {
    next(err);
  }
};


const createEmployee = async (req, res, next) => {  
  /**
    * #swagger.tags = ['Employees']
    * #swagger.summary = "Create a new employee"
    * #swagger.description = "Enter the employee information in the body template provided, employeeID is created automatically."
  */
  try {
    const employeeBody = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      birthday: req.body.birthday,
      jobTitle: req.body.jobTitle,
      department: req.body.department
    };

    const employee = await employeeSchema.validateAsync(employeeBody);

    // const swagger = JoiSwagger(employee);

    const response = await await mongodb.getDb().db().collection('employees').insertOne(employee);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw createError(500, 'Some error occurred while creating the employee.')
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422
    next(err);
  }
};

  
const updateEmployee = async (req, res, next) => {
  /**
   * #swagger.tags = ['Employees']
   * #swagger.summary = "Update employee information by ID"
   * #swagger.description = "Enter the Employee ID and any necessary changes in the body template provided."
  */

  const employeeBody = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    birthday: req.body.birthday,
    jobTitle: req.body.jobTitle,
    department: req.body.department
  };

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid employee ID to find an employee.')
    }

    const employeeId = new ObjectId(req.params.id);
    const employee = await employeeSchema.validateAsync(employeeBody);
    const response = await mongodb.getDb().db().collection('employees').replaceOne({ _id: employeeId }, employee);

    if (response.modifiedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the employee.');
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422
    next(err);
  }
  
};



const deleteEmployee = async (req, res, next) => {
  /**
   * #swagger.tags = ['Employees']
   * #swagger.summary = "Remove an employee by ID"
   * #swagger.description = "Enter the Employee ID <p> **WARNING:** The employee will be permanently removed from the database.<p>"
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid employee ID to find an employee.')
    }
    const employeeId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('employees').deleteOne({ _id: employeeId }, true);

    if (response.deletedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the employee.');
    }
  } catch (err) {
    next(err);
  }
};


module.exports = {
    getAll,
    getSingle,
    createEmployee,
    updateEmployee,
    deleteEmployee
};