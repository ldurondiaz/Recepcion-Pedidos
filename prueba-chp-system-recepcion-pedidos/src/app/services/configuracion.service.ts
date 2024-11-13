import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../model/usuario';
import { Sucursal } from '../model/sucursal';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private http: HttpClient) { }

  verificaConexion() {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.paginaRaiz);
  }

  leeConfiguracionListaSucursales() {
    return this.http.get(environment.baseUrlCatalogos + ':' + environment.puertoCatalogos + environment.sucursales);
  }

  leeConfiguracionUsuario(usuario: Usuario) {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.usuario + '/' + usuario.usuario + '/' + `${encodeURIComponent(usuario.contrasenia)}`);
  }

  leeConfiguracionSucursal() {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.configuracion);
  }

  insertaConfiguracionSucursal(sucursal: Sucursal) {
    return this.http.post(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.configuracion, sucursal);
  }

}
