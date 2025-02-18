import { environment } from "src/environments/environment";
import { Strings } from "../utils/strings";

export class Pedido {
  idPedido: string;
  numeroPedido: number;
  idCliente: string;
  datosCliente: string;
  idDomicilioCliente: string;
  datosDomicilioCliente: string;
  claveSucursal: string;
  datosSucursal: string;
  fechaHora: string;
  tiempoEspera: string;
  estatus: string;
  modalidadEntrega: string;
  montoTotal: number;
  detallePedido: string;
  instruccionesEspeciales: string;
//  promocionesAplicadas: string;
  tipoPago: string;
  cantidadProductos: number;
  resumenPedido: string;
  urlReciboPago: string;
//  montoSubtotal: number;
//  montoDescuento: number;

  chat!: string;
  fechaRecibido!: string;
  fechaCapturado!: string;
  idEmpleadoFechaCapturado!: string;
  fechaEnviado!: string;
  idEmpleadoFechaEnviado!: string;
  fechaListo!: string;
  idEmpleadoFechaListo!: string;
  fechaAtendido!: string;
  idEmpleadoFechaAtendido!: string;

  mostrarDetallesCliente: boolean = false;
  mostrarDetallesPedido: boolean = false;

  constructor(
    idPedido: string,
    numeroPedido: number,
    idCliente: string,
    datosCliente: string,
    idDomicilioCliente: string,
    datosDomicilioCliente: string,
    claveSucursal: string,
    datosSucursal: string,
    fechaHora: string,
    tiempoEspera: string,
    estatus: string,
    modalidadEntrega: string,
    montoTotal: number,
    detallePedido: string,
    instruccionesEspeciales: string,
//    promocionesAplicadas: string,
    tipoPago: string,
    cantidadProductos: number,
    resumenPedido: string,
    urlReciboPago: string,
//    montoSubtotal: number,
//    montoDescuento: number,
  ) {
    this.idPedido = idPedido;
    this.numeroPedido = numeroPedido;
    this.idCliente = idCliente;
    this.datosCliente = datosCliente;
    this.idDomicilioCliente = idDomicilioCliente;
    this.datosDomicilioCliente = datosDomicilioCliente;
    this.claveSucursal = claveSucursal;
    this.datosSucursal = datosSucursal;
    this.fechaHora = fechaHora;
    this.tiempoEspera = tiempoEspera;
    this.estatus = estatus;
    this.modalidadEntrega = modalidadEntrega;
    this.montoTotal = montoTotal;
    this.detallePedido = detallePedido;
    this.instruccionesEspeciales = instruccionesEspeciales;
//    this.promocionesAplicadas = promocionesAplicadas;
    this.tipoPago = tipoPago;
    this.cantidadProductos = cantidadProductos;
    this.resumenPedido = resumenPedido;
    this.urlReciboPago = urlReciboPago;
//    this.montoSubtotal = montoSubtotal;
//    this.montoDescuento = montoDescuento;
  }

  public get numeroPedidoVista(): string {
    return '#' + this.numeroPedido;
  }

  public get fechaHoraVista(): string {
    return Strings.dateformatAAAAMMDDToDDMMAAAAHHMM(this.fechaHora);
  }

  public get montoTotalVista(): string {
    return this.montoTotal != null
      ? this.montoTotal.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
      })
      : '$0.00';
  }

  public get datosClienteVista(): string {
    return this.datosCliente
      .split('|') // Divide la cadena en partes usando el delimitador
      .map((item, index) => {
        if (index === 0) {
          return `Nombre: ${item}`;
        } else if (index === 1) {
          return `Teléfono: ${item}`;
        }
        return item; // Para los índices restantes, deja el valor sin cambios
      })
      .join('<br>'); // Une las partes con un salto de línea
  }

  public get datosDomicilioClienteVista(): string {
    if (this.datosDomicilioCliente !== null) {
    return ('Domicilio: |' + this.datosDomicilioCliente)
      .split('|') // Divide la cadena en partes usando el delimitador
      .join('<br>'); // Une las partes en una sola cadena sin el delimitador
    } else {
      return '';
    }
  }

  public get detallePedidoVista(): string {
    return this.detallePedido
      .split('|') // Divide la cadena en partes usando el delimitador
      .join('<br>'); // Une las partes en una sola cadena sin el delimitador
  }

  public get modalidadEntregaVista(): string {
    let entrega = '';
    switch (this.modalidadEntrega) {
      case environment.entregaDomicilio: entrega = environment.entregaDomicilioTexto; break;
      case environment.entregaSucursal: entrega = environment.entregaSucursalTexto; break;
    }
    return entrega;
  }

  public get estatusVista(): string {
    let estatus = '';
    switch (this.estatus) {
      case environment.estatusRecibePedido: estatus = environment.estatusRecibePedidoTexto; break;
      case environment.estatusCapturaPedido: estatus = environment.estatusCapturaPedidoTexto; break;
      case environment.estatusEnviaPedido: estatus = environment.estatusEnviaPedidoTexto; break;
      case environment.estatusListoPedido: estatus = environment.estatusListoPedidoTexto; break;
    }
    return estatus;
  }

  public get tipoPagoVista(): string {
    let tipoPago = '';
    switch (this.tipoPago) {
      case environment.pagoEnLinea: tipoPago = environment.pagoEnLineaTexto; break;
    }
    return tipoPago;
  }

}
