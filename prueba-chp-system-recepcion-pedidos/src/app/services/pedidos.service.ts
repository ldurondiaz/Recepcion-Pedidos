import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pedido } from '../model/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  leerListaPedidosNube(clave: string) {
    return this.http.get(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosNube + '/sucursal/' + clave);
  }

  insertarPedido(pedido: Pedido) {
    return this.http.post(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedido, pedido);
  }

  actualizarPedidoNube(pedido: Pedido) {
    return this.http.put(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosEstatus, pedido);
  }

  leerListaPedidos(clave: string, estatus: string) {
    return this.http.get(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedidos + '/sucursal/' + clave + '/' + estatus);
  }

}
