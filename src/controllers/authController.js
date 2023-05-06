const User = require('../models/user');
const { response, request } = require('express');

// para la encriptacion de claves
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../helpers/generate_jwt');

const login = async(req=request, res=response) => {

    console.log(req.body);
    // check all values passed to login
    const { email, password, ...rest } = req.body;

    try {

        // check action email validation
        if (!email || email.trim() === ''  ) {
            throw { status: 401, message: 'The email is not valid.' };
        }

        // check action password validation
        if (!password || password.trim() === '' || password.length < 6) {
            throw { status: 401, message: 'The password is not valid' };
        }

        // initialize Array[User]
        let user = undefined;
        // search by email
        user = await User.findOne({ 'email': { $regex: email, $options: 'i' } });

        // check if there are any user with the email
        if( !user || !user.status ){
            throw { status: 401, message: `There is not an user with the email ${email}` };
        }

        // check if the password is correct
        var isValidPassword = bcryptjs.compareSync(password, user.password);
        if ( !isValidPassword ){
            throw { status: 401, message: 'The password is not valid' };
        }

        // generate a JWT token
        const token = await generateJWT( user.id );
        res.status(200).send( {user, token});
    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", message: error?.message || error });
    }


}


module.exports ={
    login
}