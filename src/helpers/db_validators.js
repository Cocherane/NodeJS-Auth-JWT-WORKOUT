// MY MODULE IMPORT A SCHEMA EXPRESS
const Role = require('../models/role');
const User = require( '../models/user' );


// Validator fon each endpoint


// validator of roles
const isRoleValid = async (rol = '')  => {
    // check if the roles exists in the database
    const existRole = await Role.findOne({ rol });
    if ( !existRole) { 
        throw new Error( `The role ${role} is not valid`);
    }
} 

// validator if email exist
const emailExists = async ( email = '' ) => {
    // check if email exists in the database
    const existEmail = await User.findOne({ email });
    if ( existEmail ) { throw new Error(`The email ${email} is not valid, use other diferent`); }
}

// validator if email exist
const userIdExists = async ( userId  ) => {
    // check if email exists in the database
    const existUser = await User.findById( userId );
    if ( !existUser ) { throw new Error(`The user id ${userId} is not valid`); }
}


module.exports = {
    isRoleValid,
    emailExists,
    userIdExists
};