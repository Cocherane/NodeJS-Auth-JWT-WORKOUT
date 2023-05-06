const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validationJWT = async (req=request, res=response, next) => {
    const token = req.header('X-Auth-Token') ;

    try {
        // check if the token is valid
        if( !token ){
            throw { status: 401, message: "Invalid token" };
        }

        // validate the token against
        const { uid } = jwt.verify(token, process.env.SECRET_KEY_PUBLIC_JWT);

        // get user authentication
        const user = await User.findById(uid)

        /// check if the user is valid
        if( !user ){
            throw { status: 401, message: "Invalid token - no exist user" };
        }

        /// check if the user status is valid
        if( !user.status ){
            throw { status: 401, message: "Invalid token - user status false" };
        }
        
        req.user = user;

        next();
    } catch (error) {
        res.status(error?.status || 401).send({ status: "FAILED", message: error?.message || "Invalid token" });
    }

    
};

module.exports = {
    validationJWT
}