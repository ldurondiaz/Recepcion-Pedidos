export class Strings {

  static deleteCharacter(cadena: string) {
    let texto = cadena.replace(/-/g, "");
    return texto;
  }

  static dateformatAAAAMMDDToDDMMAAAA(cadena: string) {
    const año = cadena.substring(0, 4);
    const mes = cadena.substring(4, 6);
    const dia = cadena.substring(6, 8);
    let fecha = dia + '/' + mes + '/' + año;
    return fecha;
  }

  static dateformatAAAAMMDDToAAAA_MM_DD(cadena: string) {
    const dia = cadena.substring(0, 2);
    const mes = cadena.substring(3, 5);
    const año = cadena.substring(6, 10);
    let fecha = año + '-' + mes + '-' + dia;
    return fecha;
  }

}
