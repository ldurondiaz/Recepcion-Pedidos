import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PedidoNube } from '../model/pedidoNube';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  leerListaPedidosNube(clave: string) {
    return this.http.get(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosNube + '/sucursal/' + clave);
  }

  insertarPedido(pedido: PedidoNube) {
    return this.http.post(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedido, pedido);
  }

}
