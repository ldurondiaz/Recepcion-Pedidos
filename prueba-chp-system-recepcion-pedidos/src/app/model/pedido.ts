import { Strings } from "../utils/strings";

export class Pedido {
  idPedido!: string;
  numeroPedido!: number;
  idCliente!: string;
  datosCliente!: string;
  idDomicilioCliente!: string;
  datosDomicilioCliente!: string;
  claveSucursal!: string;
  datosSucursal!: string;
  fechaHora!: string;
  estatus!: string;
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

  chat!: string;
  fechaRecibido!: string;
  fechaCapturado!: string;
  idEmpleadoFechaCapturado!: string;
  fechaEnviado!: string;
  idEmpleadoFechaEnviado!: string;
  fechaListo!: string;
  idEmpleadoFechaEisto!: string;
  fechaAtendido!: string;
  idEmpleadoFechaAtendido!: string;

  public get numeroPedidoFormato() {
    return '#' + this.numeroPedido;
  }

  public get montoTotalFormato() {
    const formatoMoneda: string = this.montoTotal.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
    return formatoMoneda;
  }

  public get datosClienteFormato() {
    return this.datosCliente.substring(0, this.datosCliente.indexOf('|'));
  }

  public get fechaHoraFormato() {
    return Strings.dateformatAAAAMMDDToDDMMAAAAHHMMSS(this.fechaHora);
  }
}
