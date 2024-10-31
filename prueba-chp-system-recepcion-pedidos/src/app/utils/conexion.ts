import { ConfiguracionService } from './../services/configuracion.service';

export class Conexion {

  static async verificaConexion(showSpinner: boolean, configuracionSvc: ConfiguracionService): Promise<boolean> {
    showSpinner = true;
    await new Promise((f) => setTimeout(f, 1000));
    return new Promise<boolean>((resolve, reject) => {
      configuracionSvc.verificaConexion().subscribe({
          next: (response: any) => {
              const info = response;
              console.log('info->', info);
              showSpinner = false;
              resolve(true);
          },
          error: (error: any) => {
              console.log('Ocurrió un error al leer verifica conexión:', error);
              showSpinner = false;
              resolve(false); // Devolver false en caso de error.
          },
      });
    });
  }

}
