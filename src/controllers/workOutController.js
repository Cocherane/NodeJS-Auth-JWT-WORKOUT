
const WorkOut = require('../models/workout');
const { response, request } = require('express');


// get all workouts [ MONGOOSE ]
const getAllWorkOuts = async (req = request , res = response) => {
    // Catch all parameters that were passed 
    const { mode = '', equipment = '', page = 0, sort = 'createdAt', length = 10 } = req.query;
    

    try{
        // check if sort input is valid 
        if (!['name', 'mode', 'createdAt', 'updatedAt'].includes(sort)){
            throw { status: 401 , message: 'The sort parameter must be one of the following name, mode, createdAt, updatedAt '};
        }

        //  get all workouts throw MONGOOSE -> MONGODB
        const allWorkOut = await WorkOut.find( { 
            mode: { $regex: mode , $options: 'i'},
            equipment: { $elemMatch: { $regex: equipment , $options: 'i'}  },
        })
        .skip( page  * 10 )      // pagination
        .sort( [[ sort , -1 ]] ) // sort by createdAt by default firstly new workout
        .limit( length )           // limit the number of workout to send
        // send workouts and status to front end
        res.status(200).send(allWorkOut);
    }catch ( error){
        res.status( error?.status || 500 ).send( { status: "Internal server fault, when sending workouts data", message: error?.message || error });
    }
    
};

// get a workout [ MONGOOSE ]
const getOneWorkOuts = async ( req = request , res = response ) => {

    // search for a workout for id on a query
    const { q = '', search = '' } = req.query;
    
    try{

        // check action q have value ['id','name', 'mode']
        if( !q || q.trim() === '' || !['id','name', 'mode'].includes( q ) ) {
            throw { status: 401 , message: 'The q parameter must be an action validated. Example: q=id, q=name, q=mode' };
        }

        // check if the query is null, unnderfine or '' value to search
        if( !search || search.trim() === '' ) {
            throw { status: 401 , message: 'The seach parameter must be validated. Example: .../api/v1/workout?q=id&search=<workoutID>' };
        }

        // initialize output workout Array[WorkOut]
        let workOut = undefined;
        // search a workout by workout Id
        if( q === 'id' ){
            workOut = [ await WorkOut.findById( search ) ];
        }else if( q === 'mode'){
            // search by mode
            workOut = await WorkOut.find({ 'mode' : { $regex: search , $options: 'i'} });
        }else{
            // search by name
            workOut = await WorkOut.find({ 'name' : { $regex: search , $options: 'i'} });
        }
        
        
        // console.log(workOut);
        res.status(200).send( workOut );

    }catch( error){
        res.status( error?.status || 500 ).send( { status: "FAILED", message: error?.message || error });
    } 
    
};


// create a workout [ MONGOOSE ]
const createNewWorkOuts = async ( req = request , res = response) => {
    // Catch all parameters that were passed 
    const { name, mode, equipment, exercises, trainerTips, img } = req.body;
    
    // create a new workout [ MONGOOSE OBJECT ]
    const newWorkOut = new WorkOut({
        name,
        mode,
        equipment,
        exercises,
        trainerTips,
        img
    });

    try{
        // save the new workout to the database throw MONGOOSE -> MONGODB
        await newWorkOut.save();
        res.status(201).send({ msg: 'Work Out saved', workOut: newWorkOut });
    }catch (error) {
        res.status( error?.status || 500 ).send({status: "FAILED", data: { error: error?.message } });
    }

};

// update a workout [ MONGOOSE ]
const updateOneWorkOuts = async (req = request , res = response) => {

    // Catch the workout ID to update the params passed throw body
    const workoutId = req.params.workoutId;
    // the params passed throw body 
    const { _id, ...remainsWorkOutData } = req.body;

    // update the params updatesAt
    remainsWorkOutData.updatesAt = Date.now();

    
    try{
        // se comprueba que todos los datos sean validos
        if ( !workoutId ) throw{ status: 400, message: 'El Id del workout esta vacio'};
        // se comprueba que todos los datos sean validos

        //  update the workout throw MONGOOSE -> MONGODB
        const workoutUpdate = await WorkOut.findByIdAndUpdate( workoutId, remainsWorkOutData );
        // message to front end
        res.send({ status: "The workout was updated", data: workoutUpdate });
    }catch( error ){
        res.status( error?.status || 500 ).send( { status:"The workout update was failed", data:  error?.message || error });
    }
    
};


// ######################################







const deleteOneWorkOuts = async (req = request , res = response) => {
    // parametro desde la request
    const workoutId = req.params.workoutId;


    try{
        // copmprobar si el valor es valido
        if (!workoutId){ throw { status: 400, message: "El Id del workout esta vacio"}};
        // delete workout by MONGOOSE
        // const deleteWorkOuts = await WorkOut.findByIdAndRemove( workoutId, async function ( error , data){
        //     console.log('HOLA 2');
        //     if (error) {
        //         console.log('HOLA 3');
        //         throw { status: 500, message: error?.message || error };
        //     }else{
        //         console.log(data);
                
        //     }
        //     return ;
        //     // res.status( 201 ).send({ status: "The workout was deleted", data: data });
        // });
        const deleteWorkOuts = await WorkOut.findByIdAndDelete(workoutId)

        // enviar un error si la id no existe
        if (deleteWorkOuts == null){ throw { status: 400, message: "The WorkOutId is NOT valid" }; };

        // retornar la el objeto borrado
        res.status( 201 ).send({ status: "The workout was deleted", data: deleteWorkOuts  });

        
    }catch ( error ){
        res.status( error?.status || 500 ).send( { status: "The workout deleted was failed", data: error?.message || error });
    }
    
};

module.exports = {
    getAllWorkOuts,
    getOneWorkOuts,
    createNewWorkOuts,
    updateOneWorkOuts,
    deleteOneWorkOuts,
};