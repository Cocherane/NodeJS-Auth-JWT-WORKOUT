// FUNCTIONALS MODULES
const express = require('express')
const { check } = require('express-validator');

// MY MODULES IMPORT
const authController = require('../../controllers/authController')
const { fieldsValidator } = require('../../middlewares/fields_validators')



// INSTANCE OF ROUTER EXPRESS
const router = express.Router();

router.post('/login',
// [
//     check('email', 'The email 1 address is no valid').isEmail(),
//     check('password', 'The email 2 password is no valid').not().isEmpty(),
//     fieldsValidator
// ]
authController.login);

module.exports = router;