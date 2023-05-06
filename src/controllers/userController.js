const User = require('../models/user');
const { response, request } = require('express');

// para la encriptacion de claves
const bcryptjs = require('bcryptjs');



// create a workout [ MONGOOSE ]
const createNewUser = async (req = request, res = response) => {

    // Catch all parameters that were passed 
    const { name, email, password,
        gender, birth, telephone = 000000000,
        height = 0, img = 'none', rol = 'USER_ROLE',
        status = true, google = false
    } = req.body;


    // create a new workout [ MONGOOSE OBJECT ]
    const newUser = new User({
        name,
        email,
        password,
        gender,
        birth,
        telephone,
        height,
        img,
        rol,
        status,
        google
    });

    // encriptar la contrasena
    const salt = bcryptjs.genSaltSync(10);
    newUser.password = bcryptjs.hashSync(password, salt);

    try {
        // save the new workout to the database throw MONGOOSE -> MONGODB
        await newUser.save();
        res.status(201).send({ msg: 'USER SAVED', user: newUser });
    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", data: { error: error?.message } });
    }

};

// update a single user in the database
const updateOneUser = async (req = request, res = response) => {

    // Catch the workout ID to update the params passed throw body
    const userId = req.params.userId;

    // check all values passed to update
    const { _id, __v, google, password, ...rest } = req.body;


    // check if the user need change password
    if (password) {
        // encriptar la contrasena
        const salt = bcryptjs.genSaltSync(10);
        rest.password = bcryptjs.hashSync(password, salt);
    }
    try {
        const user = await User.findByIdAndUpdate( userId, rest );
        res.status(200).send({ status:"SUCCESSFULLY UPDATE", user });
    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", message: error?.message || error });
    }
}


// get users by param q= 'id','name','email'   [ MONGOOSE ]
const getUserByParams = async (req = request, res = response) => {
    // search for a workout for id on a query
    const { q = '', search = '' } = req.query;

    try {

        // check action q have value ['id','name', 'email']
        if (!q || q.trim() === '' || !['id', 'name', 'email'].includes(q)) {
            throw { status: 401, message: 'The q parameter must be an action validated. Example: q=id, q=name, q=email' };
        }

        // check if the query is null, unnderfine or '' value to search
        if (!search || search.trim() === '') {
            throw { status: 401, message: 'The seach parameter must be validated. Example: .../api/v1/users?q=id&search=<userID>' };
        }

        // initialize output workout Array[User]
        let users = undefined;
        // search a workout by workout Id
        if (q === 'id') {
            users = [await User.findById(search)];
        } else if (q === 'name') {
            // search by name
            users = await User.find({ 'name': { $regex: search, $options: 'i' } });
        } else {
            // search by email
            users = await User.find({ 'email': { $regex: search, $options: 'i' } });
        }


        res.status(200).send(users);

    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", message: error?.message || error });
    }

};


// get a user by email and password [MONGOOSE]
const getOneUserByEmailPass = async (req = request, res = response) => {
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
        user = await User.find({ 'email': { $regex: email, $options: 'i' } });

        // check if there are any user with the email
        if( !user[0] ){
            throw { status: 401, message: `There is not an user with the email ${email}` };
        }

        // check if the password is correct
        var isValidPassword = bcryptjs.compareSync(password, user[0].password);
        if ( !isValidPassword ){
            throw { status: 401, message: 'The password is not valid' };
        }


        res.status(200).send(user);

    } catch (error) {
        res.status(error?.status || 500).send({ status: "FAILED", message: error?.message || error });
    }

};


// delete a user 
const deleteOneUser = async(req, res = response) => {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate( id, { status: false } );
    // user authenticated
    const userAuth = req.user

    res.json(user);
}












module.exports = {
    createNewUser,
    updateOneUser,
    getUserByParams,
    getOneUserByEmailPass,
    deleteOneUser
};