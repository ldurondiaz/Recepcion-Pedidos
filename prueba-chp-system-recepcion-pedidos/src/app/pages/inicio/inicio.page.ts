import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
//import { SharedModule } from '../../shared/shared.module';
import { ConfiguracionService } from '../../services/configuracion.service';
import { Sucursal } from '../../model/sucursal';
import { Administrador } from '../../model/administrador';
import { Conexion } from '../../utils/conexion';
import { Mensajes } from '../../utils/mensajes';
import { RelojComponent } from '../../components/reloj/reloj.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule,/* SharedModule,*/ RelojComponent],
})
export class InicioPage implements OnInit {
  showSpinner!: boolean;
  administrador: Administrador;
  sucursal?: Sucursal;

  constructor(
    private configuracionSvc: ConfiguracionService,
    private alertController: AlertController,
    private router: Router
  ) {
    this.administrador = Administrador.getInstance();
  }

  ngOnInit() {
    this.verificarConexion();
  }

  async verificarConexion() {
    const existeConexion = await Conexion.verificaConexion(this.showSpinner, this.configuracionSvc);
    if (existeConexion) {
      this.leeConfiguracionSucursal();
    } else {
      const error = await Mensajes.mensajeErrorConexion(this.alertController, 'Error de conexión',
        'No es posible conectarse a los servidores de Cheese Pizza, por favor revisa tu conexión a Internet e intenta de nuevo.');
      if(error) {
        this.verificarConexion();
      }
    }
  }

  async leeConfiguracionSucursal() {
    this.showSpinner = true;
    //await new Promise((f) => setTimeout(f, 1000));
    this.showSpinner = false;
    this.configuracionSvc.leeConfiguracionSucursal().subscribe({
      next: async (response: any) => {
        this.sucursal = response;
        console.log('Sucursal next (inicio)--->', this.sucursal);
        if (this.sucursal) {
          this.sucursal.nombreSucursal = this.sucursal.nombre.replace('Cheese Pizza',' - Sucursal ');
          this.administrador.setSucursal(this.sucursal);
        }
          await new Promise((f) => setTimeout(f, 1000));
          this.router.navigateByUrl(environment.paginaMenu);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al leer la sucursal:');
        console.log(error);
      },
    });
  }

}
