const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res) => {

    // Revisarmos si hay errores
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({errors: errors.array() });
    }

    try {
        // Crear un nueva proyecto
        const project = new Project(req.body);
        
        //  Guardamos los datos del creador en la llave creator con json web token
        project.creator = req.user.id;
        
        // Guardamos el proyecto
        project.save();
        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtenemos todos los proyectos del usuario actual
exports.getProjects = async (req, res) => {
    try {
        // Una que verificamos el JWT se guarda el id del usuario en el req
        const projects = await Project.find({ creator: req.user.id }).sort({created: -1});
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualiza un proyecto via ID
exports.updateProject = async (req, res) => {
    
    // Revisamos si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // Extraer la información del proyecto
    const { name } = req.body;
    const newProject = {};

    if(name) {
        newProject.name = name;
    }

    try {   
        // Revisar el ID 
        let project = await Project.findById(req.params.id);
        
        // Si el proyecto existe o no
        if(!project) {
            return res.status(404).json({ msg: 'Proyecto no encontrado'});
        }
        // Verifica el creado del proyecto
        // Comparamos el id guardado en jwt desde el payload con el objeto project
        // obtenido de la base de datos
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //actualizar
        project = await Project.findByIdAndUpdate({_id: req.params.id}, {$set: newProject}, { new:true} );

        res.json({ project });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

// Elimina un proyecto por su id
exports.deleteProject = async (req, res) => {

    try {
        let project = await Project.findById(req.params.id);

        if(!project) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // Verificar el creador del proyecto
        if(project.creator.toString() !== req.user.id){
            return res.status(401).json({ msg: 'No autorizado'});
        }

        //  Eliminar el proyecto
        await Project.findOneAndRemove({ _id: req.params.id })
        res.json({msg: 'Proyecto eliminado'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}