const Record = require('../models/record');
const { response, request } = require('express');




// get a record or many records by query parameters [ MONGOOSE ]
const getRecords = async (req = request , res = response) => {

    // search for a record for id on a query
    const { q = '', search = '', sort = 'createdAt' } = req.query;
    
    try{

        // check action q have value ['id','memberId', 'record']
        if( !q || q.trim() === '' || !['recordId', 'workoutId','memberId', 'record', 'all'].includes( q ) ) {
            throw { status: 401 , message: 'The q parameter must be an action validated. Example: q=recordId, q=workoutId, q=memberId, q=record' };
        }

        // check if the query is null, unnderfine or '' value to search
        if( ['recordId', 'workoutId', 'memberId', 'record'].includes( q ) && (!search || search.trim() === '') ) {
            throw { status: 401 , message: 'The seach parameter must be validated. Example: .../api/v1/records/?q=recordId&search=<recordID>' };
        }

        // check if sort input is valid 
        if (!['record', 'createdAt'].includes(sort)){
            throw { status: 401 , message: 'The sort parameter must be one of the following sort=record, sort=createdAt '};
        }

        // initialize output record Array[Record]
        let records = undefined;
        // search a record by id
        if( q === 'recordId' ){
            records = [ await Record.findById( search ) ];
        }else if( q === 'memberId'){
            // search by menber Id
            records = await Record.find({ 'memberId' : { $regex: search , $options: 'i'} });
        }else if( q === 'record'){
            // search by description 
            records = await Record.find({ 'record' : { $regex: search , $options: 'i'} });
        }else if( q === 'workoutId'){
            // search by workout Id 
            records = await Record.find({ 'workout' : { $regex: search , $options: 'i'} });
        }else{
            // search all records and sort by 'createdAt' atribute default new one Record
            records = await Record.find({ }).sort([[ sort , -1 ]]);
        }
        
        res.status(200).send( records );

    }catch( error){
        res.status( error?.status || 500 ).send( { status: "FAILED", message: error?.message || error });
    } 
    
};


//"id": "ad75d475-ac57-44f4-a02a-8f6def58ff56",
    // "workout": "4a3d9aaa-608c-49a7-a004-66305ad4ab50",
    // "record": "160 reps",
    // "memberId": "11817fb1-03a1-4b4a-8d27-854ac893cf41",
    // "member": "/members/:memberId"



// create a record [ MONGOOSE ]
const createNewRecord = async ( req = request , res = response) => {

    // Catch all parameters that were passed 
    const { workout, record, memberId } = req.body;
    
    // create a new record [ MONGOOSE OBJECT ]
    const newRecord = new Record({
        workout,
        record,
        memberId,
    });

    try{
        // save the new recors to the database throw MONGOOSE -> MONGODB
        await newRecord.save();
        res.status(201).send({ msg: 'The record was saved', record: newRecord });
    }catch (error) {
        res.status( error?.status || 500 ).send({status: "FAILED", data: { error: error?.message } });
    }

};

module.exports = {
    getRecords,
    createNewRecord
}

