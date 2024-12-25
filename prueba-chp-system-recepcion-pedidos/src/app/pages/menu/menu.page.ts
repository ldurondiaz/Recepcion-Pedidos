import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
//import { SharedModule } from '../../shared/shared.module'
import { Sucursal } from '../../model/sucursal';
import { Administrador } from '../../model/administrador';
import { LoginComponent } from '../../components/login/login.component';
import { RelojComponent } from '../../components/reloj/reloj.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, /*SharedModule,*/ LoginComponent, RelojComponent]
})
export class MenuPage implements OnInit {

  presentingElement: any;

  administrador: Administrador;

  botonPedidos = true;
  botonConfiguracion = true;
  botonEmpleados = true;

  sucursal?: Sucursal;

  constructor(private readonly router: Router) {
    this.administrador = Administrador.getInstance();
  }

  ngOnInit() {
    this.presentingElement = document.querySelector('.botonEmpleados');
    this.sucursal = this.administrador.getSucursal();
    console.log('Sucursal (menu)--->', this.sucursal);
    if (this.sucursal) {
      this.botonPedidos = false;
      this.botonConfiguracion = true;
      this.botonEmpleados = false;
    } else {
      this.botonPedidos = true;
      this.botonConfiguracion = false;
      this.botonEmpleados = true;
    }
  }

  irAPedidos() {
    console.log('ir a pedidos');
    this.administrador.setTitulo('Pedidos');
    this.router.navigateByUrl(environment.paginaPedidos);
  }

  async irAConfiguracion() {
    console.log('ir a configuración, pero primero va a login');
    this.administrador.setTitulo('Configuracion');
    //this.router.navigateByUrl(environment.paginaLogin);
  }

  irAEmpleados() {
    console.log('ir a empleados');
    this.administrador.setTitulo('Empleados');
   // this.router.navigateByUrl(environment.paginaLogin);
  }

}
