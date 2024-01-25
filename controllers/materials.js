const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('materials').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};


const getSingle = async (req, res) => {
    const materialId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('materials').find({ _id: materialId });
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};


const createMaterial = async (req, res) => {
  const material = {
    ISBN: req.body.ISBN,
    format: req.body.format,
    author: req.body.author,
    title: req.body.title,
    publisher: req.body.publisher,
    publicationDate: req.body.publicationDate,
    genre: req.body.genre,
    language: req.body.language,
    mainDescription: req.body.mainDescription,
    rentalLength: req.body.rentalLength
  };

  const response = await mongodb.getDatabase().db().collection('materials').insertOne(material);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the contact.');
  }
};

  

module.exports = {
    getAll,
    getSingle,
    createMaterial
};