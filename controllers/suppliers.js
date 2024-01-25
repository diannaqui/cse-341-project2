const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('suppliers').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};


const getSingle = async (req, res) => {
    const supplierId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('suppliers').find({ _id: supplierId });
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};


const createSupplier = async (req, res) => {
  const supplier = {
    companyName: req.body.companyName,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    pointOfContact: req.body.pointOfContact
  };

  const response = await mongodb.getDatabase().db().collection('suppliers').insertOne(supplier);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
};

  

module.exports = {
    getAll,
    getSingle,
    createSupplier
};