const mongodb = require('../db/connect');
const createError = require('http-errors');

const ObjectId = require('mongodb').ObjectId;
const { readerSchema } = require('../helpers/validation_schema');

const getAll = async (req, res, next) => {
  /**
   * #swagger.tags = ['Readers']
   * #swagger.summary = "List all the readers"
  */
  
  try {
    const result = await mongodb.getDb().db().collection('readers').find();
    result.toArray().then((lists) => {
      if (lists.length == 0) {
        res.status(404).send(createError('There are no registered readers'));
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
   * #swagger.tags = ['Readers']
   * #swagger.summary = "Get the reader by ID"
   * #swagger.description = "Enter the reader ID."
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid reader ID to find a reader.')
    }

    const readerId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('readers').find({ _id: readerId });

    result.toArray().then((lists) => {
        if (lists.length == 0) {
          res.status(404).send(createError('The reader with that ID does not exist.'));
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
  } catch (err) {
    next(err);
  }
};


const getSingleByName = async (req, res, next) => {
  /**
   * #swagger.tags = ['Readers']
   * #swagger.summary = "Get the reader by Name"
   * #swagger.description = "Enter the reader First Name and Last Name"
  */

  try {

    const readerFirstName = req.params.firstName;
    const readerLastName = req.params.lastName;

    console.log(readerFirstName, readerLastName);

    const result = await mongodb.getDb().db().collection('readers').find({ firstName: readerFirstName, lastName: readerLastName});

    result.toArray().then((lists) => {
        if (lists.length == 0) {
          res.status(404).send(createError('The reader does not exist.'));
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
  } catch (err) {
    next(err);
  }
};



const createReader = async (req, res, next) => {  
  /**
    * #swagger.tags = ['Readers']
    * #swagger.summary = "Create a new reader"
    * #swagger.description = "Enter the reader information in the body template provided, readerID is created automatically."
  */

  
  try {
    const readerBody = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      birthday: req.body.birthday,
    };

    const reader = await readerSchema.validateAsync(readerBody);
    const response = await await mongodb.getDb().db().collection('readers').insertOne(reader);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw createError(500, 'Some error occurred while creating the reader.')
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422
    next(err);
  }
};

  
const updateReader = async (req, res, next) => {
  /**
   * #swagger.tags = ['Readers']
   * #swagger.summary = "Update reader information by ID"
   * #swagger.description = "Enter the reader ID and any necessary changes in the body template provided."
  */

  const readerBody = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    birthday: req.body.birthday,
  };

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid reader ID to find an reader.')
    }

    const readerId = new ObjectId(req.params.id);
    const reader = await readerSchema.validateAsync(readerBody);
    const response = await mongodb.getDb().db().collection('readers').replaceOne({ _id: readerId }, reader);

    if (response.modifiedCount > 0) {
      res.status(204).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the reader.');
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422
    next(err);
  }
  
};



const deleteReader = async (req, res, next) => {
  /**
   * #swagger.tags = ['Readers']
   * #swagger.summary = "Remove a reader by ID"
   * #swagger.description = "Enter the reader ID <p> **WARNING:** The reader will be permanently removed from the database.<p>"
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid reader ID to find an reader.')
    }
    const readerId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('readers').deleteOne({ _id: readerId }, true);

    if (response.deletedCount > 0) {
      res.status(204).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the reader.');
    }
  } catch (err) {
    next(err);
  }
};


module.exports = {
    getAll,
    getSingle,
    getSingleByName,
    createReader,
    updateReader,
    deleteReader
};