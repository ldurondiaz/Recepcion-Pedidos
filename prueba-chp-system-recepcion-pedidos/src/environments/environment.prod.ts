// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,

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
  pedido: '/pedido',
  //Páginas
  paginaRaiz: '/',
  paginaInicio: '/inicio',
  paginaMenu: '/menu',
  paginaPedidos: '/pedidos',
  paginaConfiguracion: '/configuracion',
  paginaEmpleados: '/empleados',
  paginaLogin: '/login',
  //Constantes
  agregarEmpleado: 'Agregar Empleado',
  editarEmpleado: 'Editar Empleado',
  eliminarEmpleado: 'Eliminar Empleado',
  si_bd: 'S',
  no_bd: 'N',
  moduloPedidos: 'Pedidos',
  moduloConfiguracion: 'Configuracion',
  moduloEmpleados: 'Empleados'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
