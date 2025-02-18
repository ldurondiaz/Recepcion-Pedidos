const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./queries');
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.get('/', (request, response) => {
    response.json({ info: 'API Cheese Pizza Pedidos Móviles versión: 20240822 0800' });
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Node.js!' });
});

//Endpoints Usuario
app.get('/usuario/:usuario/:contrasenia', db.leeConfiguracionUsuario);
//Endpoints Configuración
app.get('/configuracion', db.leeConfiguracionSucursal);
app.post('/configuracion', db.insertaConfiguracionSucursal);
//Endpoints Empleados
app.get('/empleado-tipos', db.leeListaEmpleadoTipos);
app.get('/empleados', db.leeListaEmpleados);
app.get('/empleado/:id', db.leeEmpleado);
app.post('/empleado', db.insertaEmpleado);
app.put('/empleado', db.actualizaEmpleado);
app.put('/empleado-baja', db.eliminaEmpleado);
app.get('/empleado-nip/:nip', db.leeEmpleadoPorNip);

//Endpoints Pedidos
app.get('/pedidos/sucursal/:claveSucursal', db.leeListaPedidos);
app.post("/pedido", db.insertaPedido);
app.put("/pedido", db.actualizaEstatusPedido);
app.post("/pedido/historial", db.insertaPedidoHistorial);
app.get('/pedidos/historial/:claveSucursal', db.leeListaPedidosHistorial);
app.delete('/pedido/:idPedido', db.eliminaPedido);

app.listen(port, () => {
    console.log('API Cheese Pizza Móvil corriendo en el puerto', port);
});
