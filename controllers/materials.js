const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;


const getAll = async (req, res) => {
  const result = await mongodb.getDb().db().collection('materials').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};


// Get a single material by id
const getSingle = async (req, res) => {
    const materialId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('materials').find({ _id: materialId });
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
};


// Get a material by format
const getMaterial = async (req, res) => {
    const materialId = req.params.format;
    const result = await mongodb.getDb().db().collection('materials').find({format: new RegExp('^' + materialId + '$', 'i')} );
    result.toArray().then((lists) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });
};


const createMaterial = async (req, res) => {
  const material = {
    ISBN: req.body.ISBN,
    format: req.body.format,
    author: req.body.author,
    title: req.body.title,
    audience: req.body.audience,
    publicationDate: req.body.publicationDate,
    summary: req.body.summary,
    language: req.body.language,
    subject: req.body.subject,
    rentalLength: req.body.rentalLength
  };

  const response = await mongodb.getDb().db().collection('materials').insertOne(material);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the material.');
  }
};

  
const updateMaterial = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid material id to find a material.');
    }
    const materialId = new ObjectId(req.params.id);

    const material = {
        ISBN: req.body.ISBN,
        format: req.body.format,
        author: req.body.author,
        title: req.body.title,
        audience: req.body.audience,
        publicationDate: req.body.publicationDate,
        summary: req.body.summary,
        language: req.body.language,
        subject: req.body.subject,
        rentalLength: req.body.rentalLength
    };

    const response = await mongodb.getDb().db().collection('materials').replaceOne({ _id: materialId }, material);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the material.');
    }
  };
  
  const deleteMaterial = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid material id to find a material.');
    }
    const materialId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('materials').remove({ _id: materialId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the material.');
    }
  };


module.exports = {
    getAll,
    getSingle,
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
};