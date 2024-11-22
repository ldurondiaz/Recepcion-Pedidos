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
    const {clave, nombre} = request.body;
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

const leeListaEmpleadoTipos = (request, response) => {
    pool.query('SELECT id, tipo '
        + 'FROM catalogos.empleadotipo '
        + 'ORDER BY tipo;',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}

const leeListaEmpleados = (request, response) => {
    pool.query(
        'SELECT id, clave_sucursal as claveSucursal, nombre, domicilio, telefono, '
        + 'fecha_ingreso as fechaIngreso, empleadotipo_id as empleadoTipoId, '
        + '(SELECT tipo FROM catalogos.empleadotipo WHERE empleadotipo_id=id) as tipo, '
        + 'activo, nip, baja '
        + 'FROM empleado.empleado '
        + 'WHERE baja = \'N\' '
        + 'ORDER BY nombre',
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}

const leeEmpleado = (request, response) => {
    const id = request.params.id;
    pool.query(
        'SELECT id, clave_sucursal as claveSucursal, nombre, domicilio, telefono, fecha_ingreso as fechaIngreso, '
        + 'empleadotipo_id as empleadoTipoId, activo, nip, baja '
        + 'FROM empleado.empleado '
        + 'WHERE id = $1;',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows[0]);
        }
    );
}

const insertaEmpleado = (request, response) => {
    const {id, claveSucursal, nombre, domicilio, telefono, fechaingreso,
        empleadotipoid, activo, nip, baja} = request.body;
    pool.query(
        'INSERT INTO empleado.empleado( '
        + 'id, clave_sucursal, nombre, domicilio, telefono, fecha_ingreso, '
        + 'empleadotipo_id, activo, nip, baja) '
        + 'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;',
        [id, claveSucursal, nombre, domicilio, telefono, fechaingreso,
        empleadotipoid, activo, nip, baja],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó un empleado de nuevo ingreso: ' + results.rows[0].id + '"}';
            response.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const actualizaEmpleado = (request, response) => {
    const {id, claveSucursal, nombre, domicilio, telefono, fechaingreso,
        empleadotipoid, activo, nip} = request.body;
    pool.query(
        'UPDATE empleado.empleado '
        + 'SET clave_sucursal = $2, nombre = $3, domicilio = $4, telefono = $5, '
        + 'fecha_ingreso = $6, empleadotipo_id = $7, activo = $8, nip = $9 '
        + 'WHERE id = $1 RETURNING *;',
        [id, claveSucursal, nombre, domicilio, telefono, fechaingreso,
        empleadotipoid, activo, nip],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se actualizó salsa: ' + results.rows[0].id + '"}';
            response.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const eliminaEmpleado = (request, response) => {
    const {id} = request.body;
    pool.query(
        'UPDATE empleado.empleado '
        + 'SET baja = \'S\' '
        + 'WHERE id = $1;',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se eliminó ' + results.rowCount + ' empleado: ' + id + '"}';
            response.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const insertaPedido = (request, response) => {
    console.log('en el endpoint getPedidosBySucursal falta considerar los campos:');
    console.log('monto_subtotal -> montoSubtotal y monto_descuento -> montoDescuento');
    const {idPedido, numeroPedido, idCliente, datosCliente, idDomicilioCliente,
        datosDomicilioCliente, claveSucursal, datosSucursal, fechaHora, estatus,
        modalidadEntrega, montoTotal, detallePedido, instruccionesEspeciales, promocionesAplicadas,
        tipoPago, cantidadProductos, resumenPedido, urlReciboPago, montoSubtotal,
        montoDescuento, fechaRecibido
    } = request.body;
    pool.query(
        'INSERT INTO pedido.pedido '
        + '('
        + 'id_pedido, numero_pedido, id_cliente, datos_cliente, id_domicilio_cliente, '
        + 'datos_domicilio_cliente, clave_sucursal, datos_sucursal, fecha_hora, estatus, '
        + 'modalidad_entrega, monto_total, detalle_pedido, instrucciones_especiales, promociones_aplicadas, '
        + 'tipo_pago, cantidad_productos, resumen_pedido, url_recibo_pago, monto_subtotal, '
        + 'monto_descuento, fecha_recibido'
        + ') '
        + 'VALUES '
        + '('
        + '$1, $2, $3, $4, $5, '
        + '$6, $7, $8, $9, $10, '
        + '$11, $12, $13, $14, $15, '
        + '$16, $17, $18, $19, $20, '
        + '$21, $22'
        + ') RETURNING *;',
        [idPedido, numeroPedido, idCliente, datosCliente, idDomicilioCliente,
            datosDomicilioCliente, claveSucursal, datosSucursal, fechaHora, estatus,
            modalidadEntrega, montoTotal, detallePedido, instruccionesEspeciales, promocionesAplicadas,
            tipoPago, cantidadProductos, resumenPedido, urlReciboPago, montoSubtotal,
            montoDescuento, fechaRecibido
        ],
        (error, results) => {
            if (error) {
                throw error;
            }
            textoRespuesta = '{"respuesta": "Se insertó un pedido nuevo: ' + results.rows[0].id_pedido + '"}';
            response.status(201).json(JSON.parse(textoRespuesta));
        }
    );
}

const leeListaPedidos  = (request, response) => {
    const claveSucursal = request.params.claveSucursal;
    const estatusPedido = request.params.estatus;
    console.log('claveSucursal:', claveSucursal);
    console.log('estatusPedido:', estatusPedido);
    pool.query(
        'SELECT id_pedido as "idPedido", numero_pedido as "numeroPedido", id_cliente as "idCliente", ' +
        'datos_cliente as "datosCliente", id_domicilio_cliente as "idDomicilioCliente", ' +
        'datos_domicilio_cliente as "datosDomicilioCliente", clave_sucursal as "claveSucursal", ' +
        'datos_sucursal as "datosSucursal", fecha_hora as "fechaHora", estatus, ' +
        'modalidad_entrega as "modalidadEntrega", ' +
        'monto_total as "montoTotal", ' +
        'detalle_pedido as "detallePedido", instrucciones_especiales as "instruccionesEspeciales", ' +
        'promociones_aplicadas as "promocionesAplicadas", tipo_pago as "tipoPago", ' +
        'cantidad_productos as "cantidadProductos", resumen_pedido as "resumenPedido", ' +
        'url_recibo_pago as "urlReciboPago" ' +
        'FROM pedido.pedido ' +
        'WHERE clave_sucursal = $1 ' +
        'AND estatus = $2 ' +
        'ORDER BY fecha_hora',
        [claveSucursal, estatusPedido],
        (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);
        }
    );
}

module.exports = {
    leeConfiguracionSucursal,
    leeConfiguracionUsuario,
    insertaConfiguracionSucursal,
    leeListaEmpleadoTipos,
    leeListaEmpleados,
    leeEmpleado,
    insertaEmpleado,
    actualizaEmpleado,
    eliminaEmpleado,
    insertaPedido,
    leeListaPedidos
}
