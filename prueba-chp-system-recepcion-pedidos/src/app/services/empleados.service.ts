import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Empleado } from '../model/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  constructor(private http: HttpClient) { }

  leeListaEmpleados() {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleados);
  }

  leeListaEmpleadosTipo() {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleadoTipos);
  }

  insertaEmpleado(empleado: Empleado) {
    return this.http.post(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleado, empleado);
  }

  leeEmpleado(id: string) {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.empleado + '/' + id);
  }

}
