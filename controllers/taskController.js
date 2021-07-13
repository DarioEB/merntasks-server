const Task = require('../models/Task');
const Project = require('../models/Project');

const { validationResult } = require('express-validator')
// Crea un nueva tarea
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        
        // Extraer el proyecto y comprobar si existe
        const { project } = req.body;

        const projectExist = await Project.findById(project);
        if(!projectExist) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(projectExist.creator.toString() !== req.user.id ) {
            return res.status(401).json({msg: 'No autorizado'});
        }

        // Creamos la tarea
        const task = new Task(req.body);
        await task.save();
        res.json({ task });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Obtiene las tareas por proyecto
exports.getTasks = async (req, res) => {
    try {

        // Extraemos el proyecto
        const { project } = req.query;

        const projectExist = await Project.findById(project);
        
        if(!projectExist) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(projectExist.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'No autorizado'})
        }   

        // Obtener las tareas por proyecto
        const tasks = await Task.find({ project }).sort({ created: -1});
        res.json({ tasks });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Actualizar una tarea
exports.updateTask = async (req, res) => {
    try {
        // Extraemos el proyecto
        const { project, name, condition } = req.body;
        
        // Comprobamos si la tarea existe
        let task;
        task = await Task.findById(req.params.id);
        if(!task) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        const projectExist = await Project.findById(project);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(projectExist.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'No autorizado'})
        }   

        // Crear un objeto con la nueva información
        const newTask = {}
        newTask.name = name;
        newTask.condition = condition;

        //  Guardar la tarea
        task = await Task.findOneAndUpdate({ _id: req.params.id}, newTask, { new: true });
        res.json({ task })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Se elimina una tarea
exports.deleteTask = async (req, res) => {
    try {
        // Extraemos el proyecto
        const { project } = req.query;
        
        // Comprobamos si la tarea existe
        let taskExist = await Task.findById(req.params.id);
        if(!taskExist) {
            return res.status(404).json({msg: 'No existe esa tarea'});
        }

        const projectExist = await Project.findById(project);

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(projectExist.creator.toString() !== req.user.id) {
            return res.status(401).json({msg: 'No autorizado'})
        }   

        // Eliminar
        await Task.findOneAndRemove({ _id: req.params.id })
        res.json({msg: 'Tarea eliminada'});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}