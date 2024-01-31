const mongodb = require('../db/connect');
const createError = require('http-errors');

const ObjectId = require('mongodb').ObjectId;
const { authorSchema } = require('../helpers/validation_schema');

const getAll = async (req, res, next) => {
  /**
   * #swagger.tags = ['Authors']
   * #swagger.summary = "List all the authors"
  */
  
  try {
    const result = await mongodb.getDb().db().collection('authors').find();
    result.toArray().then((lists) => {
      if (lists.length == 0) {
        res.status(404).send(createError('There are no registered authors'));
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
   * #swagger.tags = ['Authors']
   * #swagger.summary = "Get the author by the ID register in MongoDB"
   * #swagger.description = "Enter the author ID."
  */

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid author ID to find a author.')
    }

    const authorIdDB = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection('authors').find({ _id: authorIdDB });

    result.toArray().then((lists) => {
        if (lists.length == 0) {
          res.status(404).send(createError('The author with that ID does not exist.'));
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
  } catch (err) {
    next(err);
  }
};


const getSinglePersonalId = async (req, res, next) => {
  /**
   * #swagger.tags = ['Authors']
   * #swagger.summary = "Get the author by its personal ID"
   * #swagger.description = "Enter the author ID."
  */

  try {

    const authorId = req.params.id;
    const result = await mongodb.getDb().db().collection('authors').find({ authorId: authorId });

    result.toArray().then((lists) => {
        if (lists.length == 0) {
          res.status(404).send(createError('The author with that ID does not exist.'));
          return;
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(lists[0]);
    });
  } catch (err) {
    next(err);
  }
};



const createAuthor = async (req, res, next) => {  
  /**
    * #swagger.tags = ['Authors']
    * #swagger.summary = "Create a new author"
    * #swagger.description = "Enter the author information in the body template provided, authorID is created automatically."
  */


  try {

    const authorBody = {
      authorId: req.body.authorId,
      authorFirstName: req.body.authorFirstName,
      authorLasttName: req.body.authorLasttName,
      email: req.body.email,
      authorBio: req.body.authorBio
    };

    const author = await authorSchema.validateAsync(authorBody);
    const response = await await mongodb.getDb().db().collection('authors').insertOne(author);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      throw createError(500, 'Some error occurred while creating the author.')
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422
    next(err);
  }
};

  
const updateAuthor = async (req, res, next) => {
  /**
   * #swagger.tags = ['Authors']
   * #swagger.summary = "Update author information by ID"
   * #swagger.description = "Enter the author ID and any necessary changes in the body template provided."
  */

  const authorBody = {
    authorId: req.body.authorId,
    authorFirstName: req.body.authorFirstName,
    authorLasttName: req.body.authorLasttName,
    email: req.body.email,
    authorBio: req.body.authorBio,
  };

  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid author ID to find an author.')
    }

    const authorId = new ObjectId(req.params.id);
    const author = await authorSchema.validateAsync(authorBody);
    const response = await mongodb.getDb().db().collection('authors').replaceOne({ _id: authorId }, author);

    if (response.modifiedCount > 0) {
      res.status(204).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the author.');
    }
  } catch (err) {
    if (err.isJoi === true) err.status = 422
    next(err);
  }
  
};



const deleteAuthor = async (req, res, next) => {
  /**
   * #swagger.tags = ['Authors']
   * #swagger.summary = "Remove a author by ID"
   * #swagger.description = "Enter the author ID <p> **WARNING:** The author will be permanently removed from the database.<p>"
  */
  try {
    if (!ObjectId.isValid(req.params.id)) {
      throw createError(400, 'You must use a valid author ID to find an author.')
    }
    const authorId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('authors').deleteOne({ _id: authorId }, true);

    if (response.deletedCount > 0) {
      res.status(204).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the author.');
    }
  } catch (err) {
    next(err);
  }
};


module.exports = {
    getAll,
    getSingle,
    getSinglePersonalId,
    createAuthor,
    updateAuthor,
    deleteAuthor
};