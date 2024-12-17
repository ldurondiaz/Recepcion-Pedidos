import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pedido } from '../model/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  leerPedidosPendientesBDLocal(clave: string, estatus: string) {
    return this.http.get<Pedido>(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedidos + '/sucursal/' + clave + '/' + estatus);
  }

  leerPedidosNubeServidor(clave: string) {
    return this.http.get(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosNube + '/sucursal/' + clave);
  }

  insertarPedidoBDLocal(pedido: Pedido) {
    return this.http.post(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedido, pedido);
  }

  actualizarPedidoNubeServidor(pedido: Pedido) {
    return this.http.put(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosEstatus + '/' + pedido.estatus + '/' + pedido.idPedido, pedido);
  }

}
