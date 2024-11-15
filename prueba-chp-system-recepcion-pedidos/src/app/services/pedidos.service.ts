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
    console.log('pedido id:', pedido.idPedido);
    console.log('pedido estatus:', pedido.estatus);
    return this.http.put(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosEstatus, pedido);
  }

}
