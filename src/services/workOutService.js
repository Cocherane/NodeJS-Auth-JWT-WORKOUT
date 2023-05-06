const workOut = require('../database/workout');
const { v4: uuid } = require("uuid");

const getAllWorkOuts = ( filterParams ) => {

    try{
        const allWorkOut = workOut.getAllWorkOuts( filterParams );
        return allWorkOut;
    }catch( error ){
        throw  error ;
    }
    
    };

const getOneWorkOuts = ( workoutId ) => { 
    try{
        const workOutById = workOut.getOneWorkOut( workoutId ); 
        return workOutById;
    }catch( error ){
        throw error ;
    }
    
};

const createNewWorkOuts = (newWorkOut) => { 
    const workoutToInsert = {
        id: uuid(),
        ...newWorkOut,
        createdAt: new Date().toLocaleDateString('es-US', { timeZone: 'UTC'}),
        updatedAt: new Date().toLocaleDateString('es-US', { timeZone: 'UTC'}),
    };
    const createdWorkOut = workOut.createNewWorkOuts(workoutToInsert);
    return createdWorkOut;
};

const updateOneWorkOuts = ( workoutId, change ) => {
    try{
        const updatedWorkOut = workOut.updateOneWorkOuts(workoutId, change);
        return updatedWorkOut; 
    }catch ( error){
        throw error;
    }
    
    }; 

const deleteOneWorkOuts = ( workoutId ) => { 
    try{
        
        const workOutDeleteById = workOut.deleteOneWorkOuts( workoutId );
        return workOutDeleteById
    }catch ( error){
        throw error;
    }
};

module.exports = {
    getAllWorkOuts,
    getOneWorkOuts,
    createNewWorkOuts,
    updateOneWorkOuts,
    deleteOneWorkOuts
};