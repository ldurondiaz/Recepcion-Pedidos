export class PedidoNube {
  id!: string;
  numeroPedido!: string;
  idCliente!: string;
  datosCliente!: string;
  idDomicilioCliente!: string;
  datosDomicilioCliente!: string;
  claveSucursal!: string;
  datosSucursal!: string;
  fechaHora!: string;
  estatus!: number;
  modalidadEntrega!: string;
  montoTotal!: number;
  detallePedido!: string;
  instruccionesEspeciales!: string;
  promocionesAplicadas!: string;
  tipoPago!: string;
  cantidadProductos!: number;
  resumenPedido!: string;
  urlReciboPago!: string;
  montoSubtotal!: number;
  montoDescuento!: number;
}
