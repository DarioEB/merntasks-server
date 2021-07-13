 // Rutas para autenticar usuarios
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
// Iniciar sesión 
// api/users
router.post('/',
 
    authController.authenticateUser
);

// Obtiene el usuario authenticado
router.get('/',
    auth,
    authController.authenticatedUser
);

module.exports = router;