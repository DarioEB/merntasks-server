const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Leemos el token del header
    const token = req.header('x-auth-token');
    // console.log(token);

    // Revisamos si no hay token
    if(!token) {
        return res.status(401).json({msg: 'No hay token, permiso no válido'});
    }

    // Validar el token
    try {
        const encryption = jwt.verify(token, process.env.SECRET); // Este método no permite verificar el token
        req.user = encryption.user;
        next(); // Next para que se vaya al siguiente middleware
        
    } catch (error) {
        res.status(401).json({msg: 'Token no válido'});
    }
}