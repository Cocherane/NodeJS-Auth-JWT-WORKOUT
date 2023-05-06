// FUNCTIONALS MODULES
const express  = require('express')
const cors = require('cors');
const { json } = require('express');


// MY MODULES IMPORT
const v1Router = require('../v1/routes/workOutRoutes');
const v1AuthRouter = require('../v1/routes/authRoutes');

const { dbConnection } = require('../database/config');

// SERVER CLASS
class Server{

    constructor(){

        // INSTANCE AND CONFIGURATION
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.apiPath = process.env.PATH_URL_MAIN || '/api'; // /api process.env.PATH_URL_MAIN ||
        this.authPath = process.env.PATH_AUTH_PATH || '/api/auth'; // /api process.env.PATH_AUTH_PATH 

        // LOADERS

        // Cone

        // Middleware 
        this.middleware();

        // connection Db
        this.conectionDB();

        // Routes
        this.routes();

    }

    // middleware DB
    middleware(){

        // CORS 
        this.app.use( cors() );
        
        // PARSE AND READ JSON
        this.app.use( json() );
        
        // PUBLIC DIRECTORY TO HTML
        this.app.use( express.static( 'src/public' ) );

    }

    // conection DB METHOD
    async conectionDB(){
        await dbConnection();
    }

    // routes 
    routes(){
        this.app.use(this.apiPath, v1Router );
        this.app.use(this.authPath, v1AuthRouter );

    }

    // Lister Loader
    listen( ){
        this.app.listen( this.port, () => {
            console.log(`Listening on ${this.port}`);
        });
    }
}


// EXPORT MODULE TO index.js
module.exports = Server;