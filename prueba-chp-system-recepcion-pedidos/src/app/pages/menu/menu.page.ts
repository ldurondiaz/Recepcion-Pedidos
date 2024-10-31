import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/shared.module'
import { ConfiguracionService } from '../../services/configuracion.service';
import { Sucursal } from '../../model/sucursal';
import { Administrador } from '../../model/administrador';
import { EncriptarDesencriptar } from '../../utils/encriptarDesencriptar';
import { LoginComponent } from '../../components/login/login.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, SharedModule, LoginComponent]
})
export class MenuPage implements OnInit {

  presentingElement: any;

  administrador: Administrador;

  botonPedidos = true;
  botonConfiguracion = true;
  botonEmpleados = true;

  sucursal?: Sucursal;

  constructor(private configuracionSvc: ConfiguracionService, private router: Router) {
    this.administrador = Administrador.getInstance();
  }

// eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {

    this.presentingElement = document.querySelector('.botonEmpleados');

    const text = '123456';
    const encrypted = EncriptarDesencriptar.encrypt(text);
    console.log('Texto Encriptado:', encrypted);

    const decrypted = EncriptarDesencriptar.decrypt(encrypted);
    console.log('Texto Desencriptado:', decrypted);

    this.sucursal = this.administrador.getSucursal();
    console.log('Sucursal (menu)--->', this.sucursal);
    if (this.sucursal) {
      this.botonPedidos = false;
      this.botonConfiguracion = true;
      this.botonEmpleados = false;
    } else {
      this.botonConfiguracion = false;
    }
  }

  irAPedidos() {
    console.log('ir a pedidos');
    this.administrador.setTitulo('Pedidos');
    this.router.navigateByUrl(environment.paginaLogin);
  }

  async irAConfiguracion() {
    console.log('ir a configuración, pero primero va a login');
    this.administrador.setTitulo('Configuracion');
    this.router.navigateByUrl(environment.paginaLogin);
  }

  irAEmpleados() {
    console.log('ir a empleados');
    this.administrador.setTitulo('Empleados');
    //this.router.navigateByUrl(environment.paginaLogin);
  }

}
