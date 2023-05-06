// FUNCTIONALS MODULES
const express = require('express')

// MY MODULES IMPORT
const workOutController = require('../../controllers/workOutController');
const recordController = require('../../controllers/recordController');
const userController = require('../../controllers/userController');
const { fieldsValidator } = require('../../middlewares/fields_validators');
const { check } = require('express-validator');

// IMPORT ALL HELPER VALIDATORS
const { isRoleValid, emailExists, userIdExists } = require('../../helpers/db_validators');
const { validationJWT } = require('../../middlewares/jwt_validators');



// INSTANCE OF ROUTER EXPRESS
const router = express.Router();

// ENDPOINTS TO WORKOUTS ACTION 
router.get('/v1/workouts/', workOutController.getAllWorkOuts );

router.get('/v1/workout/', workOutController.getOneWorkOuts );

router.post('/v1/workout/', workOutController.createNewWorkOuts );

router.put('/v1/workout/:workoutId', workOutController.updateOneWorkOuts );

router.delete('/v1/workout/:workoutId', workOutController.deleteOneWorkOuts );

// ENDPOINTS TO RECORDS
router.get("/v1/record/", recordController.getRecords);

router.post("/v1/record/", recordController.createNewRecord);

// ENDPOINTS TO USER
router.get("/v1/users/", userController.getUserByParams );

router.get("/v1/user/", userController.getOneUserByEmailPass);

router.post("/v1/user/",
[
    // validation email
    check('name', 'The name is required').not().isEmpty(),
    check('password', 'The password should have a length of 6 characters').isLength( { min: 6} ),
    check('email', 'The email is not valid').isEmail(),
    // check('rol', 'The role is not valid').isIn(['ADMIN_ROLE','USER_ROLE',]),
    check('email').custom( emailExists ),
    check('rol').custom( isRoleValid ),
    // catch exceptions from express-validator IS A MIDDLEWARE
    fieldsValidator 
]
,userController.createNewUser );


router.put("/v1/user/:userId",
[
    check('userId', 'The id is not of a valid user').isMongoId(),
    check('userId').custom( userIdExists ),
    check('rol').custom( isRoleValid ),
    // catch exceptions from express-validator IS A MIDDLEWARE
    fieldsValidator 
]
, userController.updateOneUser);

router.delete('/v1/user/:id',[
    validationJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userIdExists ),
    fieldsValidator 
]
, userController.deleteOneUser  );



// EXPORT MODULE TO ./server/server.js
module.exports = router;