const User = require('../models/User');
const bcryptjs = require('bcryptjs'); // Paquete para hashear passwords con node

// Mostramos el resultado de la la validacipon hecha en routes/users
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    
    // Revisamos si hay errores
    // console.log(req.body);
    const errors = validationResult(req);
    // console.log(errors);
    if( !errors.isEmpty() ) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extraer email y password 
    const { email, password } = req.body;

    try {
        // Revisar que el usuario restrado sea unico
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({msg: 'El usuario ya existe' });
        }
        
        // crea el nuevo usuario
        user = new User(req.body);

        // Hashear el password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        // guarda el usuario
        await user.save();

        // Crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        // Firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600 // 1 hora
        }, (error, token) => {
            if(error) throw error;

            // Mensaje de confirmación
            res.json({ token: token, msg: "Usuario creado correctamente" });
        });

        // res.json({ mgs: 'El usuario ha sido creado correctamente'});
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error');
    }
}