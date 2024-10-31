const Pool = require('pg').Pool

//Base de datos local LGDD
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 5432
const DB_NAME = process.env.DB_NAME || 'cheesepizzapedidosmovilesdb'
const DB_USER = process.env.DB_USER || 'cheesepizzauser'
const DB_PASSWORD = process.env.DB_PASSWORD || 'cheesepizza2001'

//Pool de conexiones a base de datos
const pool = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
//    ssl: {
//        rejectUnauthorized: false,
//    },
});

const leeConfiguracionSucursal = (request, response) => {
    pool.query(
        'SELECT '
        + 'clave, '
        + 'nombre '
        +'FROM configuracion.sucursal;',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}

const leeConfiguracionUsuario = (request, response) => {
    const usuario = request.params.usuario;
    const contrasenia = request.params.contrasenia;
    pool.query(
/*        'SELECT '
        + 'id, '
        + 'usuario, '
        + 'contrasenia '
        + 'FROM '
        + 'configuracion.usuario '
        + 'WHERE usuario = $1 '
        + 'AND contrasenia = $2;',*/
        'SELECT '
        + 'EXISTS ('
        + 'SELECT 1 '
        + 'FROM configuracion.usuario '
        + 'WHERE usuario = $1 '
        + 'AND contrasenia = $2 '
        + ') AS existe;',
        [usuario, contrasenia],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}

const insertaConfiguracionSucursal = (request, response) => {
    const { clave, nombre } = request.body;
    pool.query(
        'INSERT INTO configuracion.sucursal '
        + '(clave, nombre) '
        + 'VALUES ($1, $2) RETURNING *;',
        [clave, nombre],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó sucursal: ' + results.rows[0].clave + '"}';
            response.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}


module.exports = {
    leeConfiguracionSucursal,
    leeConfiguracionUsuario,
    insertaConfiguracionSucursal
}
