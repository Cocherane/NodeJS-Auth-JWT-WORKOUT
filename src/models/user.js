

const { Schema, model  } = require('mongoose');

const UserSchema = Schema({

    name:{
        type: String,
        required: [ true, 'El nombre es Obligatorio']
    },

    email:{
        type: String,
        required: [ true, 'El email es Obligatorio'],
        unique: true,
    },

    password:{
        type: String,
        required: [ true, 'La contrasena es Obligatorio']
    },

    gender:{
        type: String,
        default: 'N/D',
        emun: ['F', 'M', 'N/D' ]
    },

    birth:{
        type: Date,
        default: null,
    },

    telephone:{
        type: Number,
    },
    
    height:{
        type: Number,
    },

    img:{
        type: String,
        default: 'none',
    },

    rol:{
        type: String,
        required: [ true, 'El rol es Obligatorio'],
        emun: ['ADMIN_ROLE', 'USER_ROLE' ],
        default: 'USER_ROLE'
    },

    status:{
        type: Boolean,
        default: true
    },

    google:{
        type: Boolean,
        default: false
    },



});

// remover some fields from object TIP. need be a funtion normal we need th [this]
UserSchema.methods.toJSON = function () {
    const { __v, password, img, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};


module.exports = model( 'User', UserSchema );