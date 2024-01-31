const mongodb = require('../db/connect');
const createError = require('http-errors');

const ObjectId = require('mongodb').ObjectId;
const { materialSchema } = require('../helpers/validation_schema');


const getAll = async (req, res, next) => {
  /**
   * #swagger.tags = ['Materials']
   * #swagger.summary = "List all the materials"
  */
  try {
    const result = await mongodb.getDb().db().collection('materials').find();
    result.toArray().then((lists) => {
      if (lists.length == 0) {
        res.status(404).send(createError('There are no registered materials'));
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
   * #swagger.tags = ['Materials']
   * #swagger.summary = "Get the material by ID"
   * #swagger.description = "Enter the material ID."
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid material ID to find an material.')
    }

    const materialId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('materials').find({ _id: materialId });

    result.toArray().then((lists) => {
        if (lists.length == 0) {
          res.status(404).send(createError('The material with that ID does not exist.'));
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
        
    });

  } catch (err) {
    next(err);
  }
};


const getMaterial = async (req, res, next) => {
  /**
   * #swagger.tags = ['Materials']
   * #swagger.summary = "Get all the material by format"
   * #swagger.description = "Enter the type of material you want to see <p>**Book, Audiobook ...**</p>"
  */
  try {
    const materialId = req.params.format;
    const result = await mongodb.getDb().db().collection('materials').find({format: new RegExp('^' + materialId + '$', 'i')} );

    result.toArray().then((lists) => {
      if (lists.length == 0) {
        res.status(404).send(createError('That material format does not exist.'))
        return;
      }
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists);
    });

  } catch (err) {
    next(err);
  }
};


const createMaterial = async (req, res, next) => {
  /**
   * #swagger.tags = ['Materials']
   * #swagger.summary = "Create a new material"
   * #swagger.description = "Enter the material information in the body template provided, materialID is created automatically."
  */

  try {

    const materialBody = {
      ISBN: req.body.ISBN,
      format: req.body.format,
      authorId: req.body.authorId,
      title: req.body.title,
      audience: req.body.audience,
      publicationDate: req.body.publicationDate,
      summary: req.body.summary,
      language: req.body.language,
      subject: req.body.subject,
      rentalTimeInWeeks: req.body.rentalTimeInWeeks
    };

    const material = await materialSchema.validateAsync(materialBody);
    const response = await await mongodb.getDb().db().collection('materials').insertOne(material);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw createError(500, 'Some error occurred while creating the material.')
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422
    next(err);
  }
};


  
const updateMaterial = async (req, res, next) => {
  /**
   * #swagger.tags = ['Materials']
   * #swagger.summary = "Update material information by ID"
   * #swagger.description = "Enter the Material ID and any necessary changes in the body template provided."
  */

  try {

    const materialBody = {
      ISBN: req.body.ISBN,
      format: req.body.format,
      authorId: req.body.authorId,
      title: req.body.title,
      audience: req.body.audience,
      publicationDate: req.body.publicationDate,
      summary: req.body.summary,
      language: req.body.language,
      subject: req.body.subject,
      rentalTimeInWeeks: req.body.rentalTimeInWeeks
    };

    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid material ID to find a material.')
    }

    const materialId = new ObjectId(req.params.id);
    const material = await materialSchema.validateAsync(materialBody);
    const response = await mongodb.getDb().db().collection('materials').replaceOne({ _id: materialId }, material);

    if (response.modifiedCount > 0) {
      res.status(204).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the material.');
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422
    next(err);
  }
};
 
  
  const deleteMaterial = async (req, res, next) => {
  /**
   * #swagger.tags = ['Materials']
   * #swagger.summary = "Remove a material by ID"
   * #swagger.description = "Enter the Material ID <p> **WARNING:** The material will be permanently removed from the database.<p>"
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid material ID to find an material.')
    }
    const materialId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('materials').deleteOne({ _id: materialId }, true);

    if (response.deletedCount > 0) {
      res.status(204).json(response);

    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the material.');
    }
  } catch (err) {
    next(err);
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