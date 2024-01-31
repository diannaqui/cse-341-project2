const express = require('express');
const router = express.Router();

const employeesController = require('../controllers/employees');
// const { isAuthenticated } = require('../middleware/authenticate');



router.get('/', employeesController.getAll);

router.get('/:id', employeesController.getSingle);

router.post('/', employeesController.createEmployee);

router.put('/:id', employeesController.updateEmployee);

router.delete('/:id', employeesController.deleteEmployee);



// router.post('/', isAuthenticated, employeesController.createEmployee);

// router.put('/:id', isAuthenticated, employeesController.updateEmployee);

// router.delete('/:id', isAuthenticated, employeesController.deleteEmployee);



module.exports = router;