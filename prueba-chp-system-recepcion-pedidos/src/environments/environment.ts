// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //Conexión Pedidos
  baseUrlPedidos: 'http://ec2-54-144-58-67.compute-1.amazonaws.com',
  puertoPedidos: 3000,
  //Endpoints
  pedidosNube: '/pedidos',

  //Conexión Catálogos
  baseUrlCatalogos: 'http://ec2-54-144-58-67.compute-1.amazonaws.com',
  puertoCatalogos: 3001,
  //Endpoints
  sucursales: '/sucursales',

  //Conexión Local
  baseUrlLocal: 'http://localhost',
  puertoLocal: 3000,
  //Endpoints
  configuracion: '/configuracion',
  usuario: '/usuario',
  empleados: '/empleados',
  empleadoTipos: '/empleado-tipos',
  empleado: '/empleado',
  empleadoBaja: '/empleado-baja',
  empleadoNip: '/empleado-nip',
  pedido: '/pedido',
  pedidosEstatus: '/pedidos/estatus',
  pedidos: '/pedidos',
  //Páginas
  paginaRaiz: '/',
  paginaInicio: '/inicio',
  paginaMenu: '/menu',
  paginaPedidos: '/pedidos',
  paginaPedidoDetalle: 'pedido-detalle',
  paginaConfiguracion: '/configuracion',
  paginaEmpleados: '/empleados',
  paginaLogin: '/login',
  //Constantes movimientos empleados
  agregarEmpleado: 'Agregar Empleado',
  editarEmpleado: 'Editar Empleado',
  eliminarEmpleado: 'Eliminar Empleado',
  //Constsntes baja empleado
  si_bd: 'S',
  no_bd: 'N',
  //Constantes módulos
  moduloPedidos: 'Pedidos',
  moduloConfiguracion: 'Configuracion',
  moduloEmpleados: 'Empleados',
  //Constantes estatus pedido
  estatusNubePedido: "NP",
  estatusNubePedidoTexto: "Pedido en la nube",
  estatusRecibePedido: "RP",
  estatusRecibePedidoTexto: "Pedido recibido",
  estatusCapturaPedido: "CP",
  estatusCapturaPedidoTexto: "Pedido capturado",
  estatusEnviaPedido: "EP",
  estatusEnviaPedidoTexto: "Pedido enviado",
  estatusListoPedido: "LP",
  estatusListoPedidoTexto: "Pedido listo para pasar por el",
  estatusAtendidoPedido:"AP",
  estatusAtendidoPedidoTexto:"Pedido atendido",
  //Constantes texto botón de la página pedido detalle
  textoBotonCapturaPedido: "Pasar a pedidos capturados",
  textoBotonEnviaPedido: "Pasar a pedidos enviados",
  textoBotonListoPedido: "Pasar a pedidos listos",
  textoBotonAtendidoPedido: "Pasar a pedidos atendidos",
  //Constantes tipo de pago
  pagoEnLinea: 'PL',
  pagoEnLineaTexto: 'Pago en línea',
  //Constantes modalidad de entrega
  entregaDomicilio: 'ED',
  entregaDomicilioTexto: 'Entrega en domicilio',
  entregaSucursal: 'ES',
  entregaSucursalTexto: 'Entrega en sucursal',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
