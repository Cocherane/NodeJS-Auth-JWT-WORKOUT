const mongoose = require('mongoose');


const dbConnection = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN);

         console.log('BASE DE DATO CONECTADA');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la BD');
    }
}


module.exports = {
    dbConnection
};