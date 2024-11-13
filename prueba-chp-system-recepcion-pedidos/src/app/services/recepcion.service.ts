import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecepcionService {

  constructor(private http: HttpClient) { }

  leerListaPedidosNube(clave: string) {
    return this.http.get(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosNube + '/sucursal/' + clave);
  }

}
