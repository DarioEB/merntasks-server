const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { check } = require('express-validator'); 

const auth = require('../middleware/auth');
// api/projects
router.post('/',
    auth, // Auth verificar todo lo que existe en la configuración de routes
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.createProject
);

// Obtiene todos los proyectos
router.get('/',
    auth,
    projectController.getProjects
)

// Actualizar proyectos
router.put('/:id',
    auth,
    [
        check('name', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.updateProject
)

// Eliminar un proyecto 
router.delete('/:id',
    auth,
    projectController.deleteProject
)

module.exports = router;