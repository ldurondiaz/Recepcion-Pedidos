import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Empleado } from '../model/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private http: HttpClient) { }

  leerListaEmpleadosTipo() {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleadoTipos);
  }

  leerListaEmpleados() {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleados);
  }

  leerEmpleado(id: string) {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleado + '/' + id);
  }

  insertarEmpleado(empleado: Empleado) {
    return this.http.post(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleado, empleado);
  }

  actualizarEmpleado(empleado: Empleado) {
    console.log('estoy en el servicio');
    return this.http.put(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleado, empleado);
  }

  eliminarEmpleado(empleado: Empleado) {
    return this.http.put(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleadoBaja, empleado);
  }

}
