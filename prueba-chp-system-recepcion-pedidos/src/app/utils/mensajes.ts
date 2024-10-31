import { FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

export class Mensajes {

  static async mensajeErrorConexion(alertController: AlertController, header: string, message: string): Promise<boolean> {
    const alert = await alertController.create({
      header: header,
      message: message,
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            return true;
          }
        }],
    });
    alert.backdropDismiss = false;
    await alert.present();

    return new Promise<boolean>((resolve) => {
      alert.onDidDismiss().then(() => {
        resolve(true);
      });
    });
  }

  static async datosError(alertController: AlertController, header: string, message: string, forma: FormGroup) {
    const alert = await alertController.create({
      header: header,
      message: message,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          forma.reset();
        }
      }],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  static async datosCorrectos(alertController: AlertController, header: string, message: string,
    forma: FormGroup, router: Router, pagina: string) {
      const aviso = await alertController.create({
        header: header,
        message: message,
        buttons: [{
          text: 'Aceptar',
          handler: () => {
            forma.reset();
            router.navigateByUrl(pagina);
          }
        }],
      });
      aviso.backdropDismiss = false;
      aviso.onclick
      await aviso.present();
  }
}
