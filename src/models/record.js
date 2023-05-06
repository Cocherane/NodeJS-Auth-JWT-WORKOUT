// FUNCTIONALS MODULES
const { Schema, model  } = require('mongoose');

const  RecordSchema  = Schema({

    workout:{
        type: String,
        required:[ true, 'The workout _id is required']
    },
    record:{
        type: String,
        required:[ true, 'The workout record is required']
    },
    memberId:{
        type: String,
        required:[ true, 'The menber id is required']

    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    member:{
        type: String,
        default:  "/members/?",
    }

    // "id": "ad75d475-ac57-44f4-a02a-8f6def58ff56",
    // "workout": "4a3d9aaa-608c-49a7-a004-66305ad4ab50",
    // "record": "160 reps",
    // "memberId": "11817fb1-03a1-4b4a-8d27-854ac893cf41",
    // "member": "/members/:memberId"

});

RecordSchema.methods.toJSON = function (){
    const { __v, ...recordData } = this.toObject();
    return recordData;
}

module.exports = model( 'Record', RecordSchema )