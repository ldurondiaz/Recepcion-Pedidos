// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //Constantes
  baseUrlLocal: 'http://localhost',
  puertoLocal: 3000,

  baseUrl: 'http://ec2-54-153-58-93.us-west-1.compute.amazonaws.com',
  puertoCatalogos: 3001,
  sucursales: '/sucursales',

  //Endpoints
  configuracion: '/configuracion',
  usuario: '/usuario',
  empleados: '/empleados',
  empleadoTipos: '/empleado-tipos',
  empleado: '/empleado',

  //Páginas
  paginaRaiz: '/',
  paginaInicio: '/inicio',
  paginaMenu: '/menu',
  paginaPedidos: '/pedidos',
  paginaConfiguracion: '/configuracion',
  paginaEmpleados: '/empleados',
  paginaLogin: '/login',

  //Constantes para la base de datos
  agregarEmpleado: 'Agregar Empleado',
  editarEmpleado: 'Editar Empleado',
  eliminarEmpleado: 'Eliminar Empleado',
  si_bd: 'S',
  no_bd: 'N',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
