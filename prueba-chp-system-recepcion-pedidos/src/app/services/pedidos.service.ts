import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pedido } from '../model/pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  constructor(private http: HttpClient) { }

  leerPedidosNubeServidor(clave: string) {
    return this.http.get(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosNube + '/sucursal/' + clave);
  }

  actualizarEstatusPedidoNubeServidor(pedido: Pedido) {
    return this.http.put(environment.baseUrlPedidos + ':' + environment.puertoPedidos + environment.pedidosEstatus + '/' + pedido.estatus + '/' + pedido.idPedido, pedido);
  }

  leerPedidosPendientesBDLocalPedido(clave: string) {
    return this.http.get<Pedido>(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedidos + '/sucursal/' + clave);
  }

  insertarPedidoBDLocalPedido(pedido: Pedido) {
    return this.http.post(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedido, pedido);
  }

  actualizarEstatusPedidoBDLocalPedido(pedido: Pedido) {
    return this.http.put(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedido, pedido);
  }

  insertarPedidoBDLocalHistorial(pedido: Pedido) {
    return this.http.post(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedido + '/historial/', pedido);
  }

  leerPedidosPendientesBDLocalPedidoHistorial(clave: string) {
    return this.http.get<Pedido>(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedidos + '/historial/' + clave);
  }

  eliminaPedidoBDLocal(pedido: Pedido) {
    return this.http.delete(environment.baseUrlLocal + ':' + environment.puertoLocal + environment.pedido + '/' + pedido.idPedido);
  }

}
