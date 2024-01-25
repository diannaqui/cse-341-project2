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
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
};

  

module.exports = {
    getAll,
    getSingle,
    createReader
};