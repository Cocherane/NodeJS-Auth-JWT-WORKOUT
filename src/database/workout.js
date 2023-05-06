const { checkout } = require('../v1/routes/workOutRoutes');
const DB = require('./db.json');
const { saveToDatabase } = require('./utils');


const getAllWorkOuts = ( filterParams ) => {
    try{
        
        console.log( filterParams.mode ?? 'NO DATA MODE');
        console.log( filterParams.equipment ?? 'NO DATA EQUIPMENT');
        console.log( filterParams.page ?? 'NO DATA PAGE');
        console.log( filterParams.sort ?? 'NO DATA SORT');
        console.log( filterParams.length ?? 'NO DATA LENGTH');
        
        // return DB.workouts;
        let workouts = DB.workouts;
        if(filterParams.mode){
            console.log( workouts.filter( (workout) => 
            
            workout.mode.toLowerCase().includes( filterParams.mode )
            
            ));
        }

        return workouts;


    }catch( error){
        throw { status: 500, message: error?.message || error };
    }

    // try {
    //     let workouts = DB.workouts;
    //     if (filterParams.mode) {
    //       return DB.workouts.filter((workout) =>
    //         workout.mode.toLowerCase().includes(filterParams.mode)
    //       );
    //     }
    //     return workouts;
    //   } catch (error) {
    //     throw { status: 500, message: error };
    //   }
    
};

const createNewWorkOuts = ( newWorkout ) => {
    //comprobar el ejercicio ya ya no este en la DB
    const isAlreadyAdded = DB.workouts.findIndex( (workout) =>  workout.name === newWorkout.name ) > -1;
    if ( isAlreadyAdded){
        throw {
            status: 400,
            message : 'workout with the name already exists'
        }
    }
    try{
        // hacemos un push en la base de dato
        DB.workouts.push( newWorkout );
        // rescribimos en el json
        saveToDatabase(DB);
        return newWorkout;
    }catch (error){
        throw { status: 500, message: error?.message || error };
    }
    
};

const getOneWorkOut = ( workoutId) => {
    try{
        const workout = DB.workouts.find( (workout) => workout.id === workoutId);
        if(!workout) throw { status: 400, message:'No existe el workout con esta ID'};
        return workout;
    }catch (error){
        throw { status: error?.status || 500, message: error?.message || error };
    }
    
};

const updateOneWorkOuts = ( workoutId, changes ) => {
    
    try{
        
        // comprob
        // Comprobacion de que el nombre del workid existe
        const indexIfExistName = DB.workouts.findIndex( (workout) => workout.name === changes.name);  
        if (indexIfExistName !== -1) { throw { status: 400, message: 'El nombre del Work Out ya existe'}};   
        // Comprobacion de que el workid existe
        const indexForUpdate = DB.workouts.findIndex( (workout) => workout.id === workoutId);
        if (indexForUpdate === -1) { throw { status: 400, message: 'La ID del Work Out no existe'}};

        const updateWorkOut = {
            ...DB.workouts[indexForUpdate],
            ...changes,
            updateAt: new Date().toLocaleDateString( 'en-US', {timeZone: 'UTC'} ),
        };

        DB.workouts[indexForUpdate] = updateWorkOut;
        saveToDatabase(DB);
        return updateWorkOut;
    }catch ( error ) {
        throw { status: error?.status || 500 , message: err?.message} ;
    };
    
};




const deleteOneWorkOuts = ( workoutId) => {
    let tempdelete;
    try{
        const workout = DB.workouts.forEach( (workout, index, db) => {
            
            if (workout.id === workoutId){
                console.log(`${workout.id}  ${workoutId}  ${index}` );
                tempdelete = DB.workouts.splice( index, 1 );
                saveToDatabase( DB )
            }
        });
        // comprobamos si se almaceno el work out en el tempdelete , de no existir enviams un mensaje 400
        if ( !tempdelete) throw { status: 400, message:"NO existe ningun work out con esta id para borrar"};
    }catch( error ){
        throw { status: error?.status || 500 , message: error?.message }
    }
    
    return tempdelete;
};


module.exports = { getAllWorkOuts, createNewWorkOuts,getOneWorkOut, updateOneWorkOuts, deleteOneWorkOuts };