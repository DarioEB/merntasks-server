const User = require('../models/User');
const bcryptjs = require('bcryptjs'); // Paquete para hashear passwords con node

const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {
    // Revisar si hay errores
    const errors = validationResult(req);
    console.log(req.body);
    console.log(errors);
    if( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Extraer el email y password
    const { email, password } = req.body;

    try { // Revisar que sea un usuario registrado
        
        let user = await User.findOne({ email });
        
        if(!user) {
            return res.status(400).json({msg: 'El usuario no existe'});
        }

        // Revisar el password
        const correctPass = await bcryptjs.compare(password, user.password);
        if(!correctPass) {
            return res.status(400).json({msg: 'Password incorrecto'});
        }  

        // Si todo es correcto creado el JWT para la sesion
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
    }
}

// Obtiene el token del usuario que está authenticado
exports.authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Hubo un error'});
    }
}