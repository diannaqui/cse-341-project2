const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('readers').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};


const getSingle = async (req, res) => {
    const readerId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('readers').find({ _id: readerId });
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};


const createReader = async (req, res) => {
  const reader = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    birthday: req.body.birthday,
  };

  const response = await mongodb.getDatabase().db().collection('readers').insertOne(reader);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the reader.');
  }
};

 
const updateReader = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid reader id to find a reader.');
    }
    const readerId = new ObjectId(req.params.id);

    const reader = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        birthday: req.body.birthday,
    };

    const response = await mongodb.getDb().db().collection('readers').replaceOne({ _id: readerId }, reader);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the reader.');
    }
  };
  
  const deleteReader = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid reader id to find a reader.');
    }
    const readerId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('readers').remove({ _id: readerId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the reader.');
    }
  };



module.exports = {
    getAll,
    getSingle,
    createReader,
    updateReader,
    deleteReader
};