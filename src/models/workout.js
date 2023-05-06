// FUNCTIONALS MODULES
const { Schema, model  } = require('mongoose');

const  WorkOutSchema  = Schema({

    name:{
        type: String,
        required:[ true, 'The name workout is required']
    },
    mode:{
        type: String,
        required:[ true, 'The mode workout is required']
    },
    equipment:{
        type: [String],

    },
    exercises:{
        type: [String],
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    updatesAt:{
        type: Date,
        default:  Date.now,
    },
    trainerTips:{
        type: [String],
    },
    img:{
        type: String,
        default: 'https://media.timeout.com/images/103388130/1372/772/image.jpg',
    }

});

WorkOutSchema.methods.toJSON = function (){
    const { __v, ...workOutData } = this.toObject();
    return workOutData;
}


module.exports = model( 'WorkOut', WorkOutSchema )