const express = require('express');
const router = express.Router();

const suppliersController = require('../controllers/suppliers');

router.get('/', suppliersController.getAll);

router.get('/:id', suppliersController.getSingle);

router.post('/', suppliersController.createSupplier);

router.put('/:id', suppliersController.updateSupplier);

router.delete('/:id', suppliersController.deleteSupplier);

module.exports = router;