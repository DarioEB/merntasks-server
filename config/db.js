const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'});

const connection = async () => {
    try {

        await mongoose.connect(process.env.DB_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB Conectada');
    } catch (error) {
        console.log(error);
        process.exit(1); // En caso de un error en la conexion
                        // Detener la app
    }
}

module.exports = connection;