
// para cactar los errores de las validaciones de express-validation
const { validationResult } = require('express-validator');

const { response, request } = require('express');


// middleware to catch errors from validation with express-validator
const fieldsValidator = ( req = request, res = response, next  ) =>{

    // catch exceptions from express-validator
    const error = validationResult( req );

    // mostrar error de la validacion de express-validation
    if ( !error.isEmpty() ) { return res.status(400).send( {status: "FAILED", error: error.mapped() }); }

    // funtion to if not found a error pass to the next sentence
    next();

}

module.exports = {
    fieldsValidator
};