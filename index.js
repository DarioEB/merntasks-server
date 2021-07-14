const express = require('express');
const connection = require('./config/db');
const cors = require('cors');
// Crear el servidor
const app = express();

// Conextar a la base de datos
connection();

// Habilitar cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

// Puerto de la app
const port = process.env.port || 4000;

// Importar rutas
app.use('/api/users', require('./routes/users') );
app.use('/api/auth', require('./routes/auth') );
app.use('/api/projects', require('./routes/projects') );

// Routing de tareas
app.use('/api/tasks', require('./routes/tasks'))

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`)
})