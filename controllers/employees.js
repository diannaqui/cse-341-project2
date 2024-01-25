const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  /**
   * #swagger.tags = ['Employees']
   * #swagger.summary = "Get all employees"
  */

  const result = await mongodb.getDb().db().collection('employees').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};


const getSingle = async (req, res) => {
  /**
   * #swagger.tags = ['Employees']
   * #swagger.summary = "Get a single employee using employee id"
   * #swagger.description = "Enter the Employee ID."
  */
    const employeeId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('employees').find({ _id: employeeId });
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};


const createEmployee = async (req, res) => {  
  /**
    * #swagger.tags = ['Employees']
    * #swagger.summary = "Add an employee"
    * #swagger.description = "Enter the employee information in the body template provided, employeeID is created automatically."
  */
  const employee = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    birthday: req.body.birthday,
    jobTitle: req.body.jobTitle,
    department: req.body.department,
    salary: req.body.salary
  };

  const response = await mongodb.getDb().db().collection('employees').insertOne(employee);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the employee.');
  }
};

  
const updateEmployee = async (req, res) => {
  /**
   * #swagger.tags = ['Employees']
   * #swagger.summary = "Change employee information"
   * #swagger.description = "Enter the Employee ID and any necessary changes in the body template provided."
  */
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid contact id to find a employee.');
  }
  const userId = new ObjectId(req.params.id);
  const employee = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    birthday: req.body.birthday,
    jobTitle: req.body.jobTitle,
    department: req.body.department, 
    salary: req.body.salary
  };

  const response = await mongodb.getDb().db().collection('employees').replaceOne({ _id: userId }, employee);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the employee.');
  }
};



const deleteEmployee = async (req, res) => {
  /**
   * #swagger.tags = ['Employees']
   * #swagger.summary = "Delete an employee"
   * #swagger.description = "Enter the Employee ID <p> **WARNING:** The contact will be permanently removed from the database.<p>"
  */
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid contact id to find a contact.');
  }
  const employeeId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('employees').remove({ _id: employeeId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
  }
};


module.exports = {
    getAll,
    getSingle,
    createEmployee,
    updateEmployee,
    deleteEmployee
};