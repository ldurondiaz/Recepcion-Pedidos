import { environment } from "src/environments/environment";
import { Strings } from "./strings";

export class Procesamiento {

  static fechaHora(cadena: string) {
    return Strings.dateformatAAAAMMDDToDDMMAAAAHHMMSS(cadena);
  }

  static datosCliente(cadena: string) {
    return cadena.substring(0,cadena.indexOf('|'));
  }

  static datosVariosRenglones(cadena: string | null | undefined): string {
    // Si la cadena no es válida (null, undefined o vacía), regresa un mensaje predeterminado
    if (!cadena) {
      return '';
    }

    // Si la cadena no contiene el separador, regresa la cadena tal cual
    if (!cadena.includes('|')) {
      return cadena;
    }

    // Divide y reemplaza el separador con <br>
    return cadena.split('|').join('<br>');
  }

  static tipoPago(cadena: string) {
    switch (cadena) {
      case 'PL': return 'Pago en línea';
      default: return 'No existe este tipo de pago';
    }
  }

  static modalidadEntrega(cadena: string) {
    switch (cadena) {
      case 'ED': return 'Entrega en domicilio';
      case 'ES': return 'Entrega en sucursal';
      default: return 'No existe este tipo de entrega';
    }
  }

  static estatus(cadena: string) {
    switch (cadena) {
      case environment.estatusNubePedido: return 'Pedidos en la nube';
      case environment.estatusRecibePedido: return 'Pedidos recibidos';
      case environment.estatusCapturaPedido: return 'Pedidos capturados';
      case environment.estatusEnviaPedido: return 'Pedidos enviados';
      case environment.estatusListoPedido: return 'Pedidos listos';
      case environment.estatusAtendidoPedido: return 'Pedidos atendidos';
      default: return 'No existe este tipo de estatus';
    }
  }
}
