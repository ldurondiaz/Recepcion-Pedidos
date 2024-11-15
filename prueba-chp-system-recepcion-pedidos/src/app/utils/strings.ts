export class Strings {

  static fechaHoraActualAAAAMMDDHHMMSSsss() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    const milisegundos = fecha.getMilliseconds().toString().padStart(3, '0');
    return año + mes + dia + hora + minutos + segundos + milisegundos;
  }

  static deleteCharacter(cadena: string) {
    let texto = cadena.replace(/-/g, "");
    return texto;
  }

  static dateformatAAAAMMDDToDDMMAAAA(cadena: string) {
    const año = cadena.substring(0, 4);
    const mes = cadena.substring(4, 6);
    const dia = cadena.substring(6, 8);
    return dia + '/' + mes + '/' + año;
  }

  static dateformatAAAAMMDDToAAAA_MM_DD(cadena: string) {
    const dia = cadena.substring(0, 2);
    const mes = cadena.substring(3, 5);
    const año = cadena.substring(6, 10);
    return año + '-' + mes + '-' + dia;
  }

  static dateformatAAAAMMDDToDDMMAAAAHHMMSS(cadena: string) {
    const año = cadena.substring(0, 4);
    const mes = cadena.substring(4, 6);
    const dia = cadena.substring(6, 8);
    const hrs = cadena.substring(8, 10);
    const min = cadena.substring(10, 12);
    const seg = cadena.substring(12, 14);
    return dia + '/' + mes + '/' + año + ' ' + hrs + ':' + min + ':' + seg;
  }

}
