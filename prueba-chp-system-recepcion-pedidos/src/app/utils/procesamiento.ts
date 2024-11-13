import { Strings } from "./strings";

export class Procesamiento {

  static fechaHora(cadena: string) {
    return Strings.dateformatAAAAMMDDToDDMMAAAAHHMMSS(cadena);
  }

  static datosCliente(cadena: string) {
    const pos = cadena.indexOf('|');
    return cadena.substring(0, pos);
  }

}
