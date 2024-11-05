import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { environment } from '../../../environments/environment';
import { Administrador } from '../../model/administrador';
//import { SharedModule } from '../../shared/shared.module'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { ConfiguracionService } from '../../services/configuracion.service';
import { Usuario } from '../../model/usuario';
import { EncriptarDesencriptar } from '../../utils/encriptarDesencriptar';
import { Mensajes } from '../../utils/mensajes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule/*, SharedModule*/]
})
export class LoginComponent implements OnInit {

  administrador: Administrador;
  titulo: string = '';
  credencialesForma!: FormGroup;
  usuario: string = '';
  contrasenia: string = '';

  constructor(private modalController: ModalController, private fb: FormBuilder,
    private alertController: AlertController, private configuracionSvc: ConfiguracionService,
    private router: Router) {
    addIcons({ closeOutline });
    this.administrador = Administrador.getInstance();
    this.credencialesForma = this.fb.group({
      usuario: ['gerardo.diaz', Validators.required],
      contrasenia: ['123456', Validators.required]
    });
  }

  ngOnInit() {
    this.titulo = this.administrador.getTitulo();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  irA() {
    console.log('navegar a: ', this.titulo);
    switch (this.titulo) {
      case 'Pedidos':
        this.router.navigateByUrl(environment.paginaPedidos);
        break;
      case 'Configuracion':
        this.router.navigateByUrl(environment.paginaConfiguracion);
        break;
      case 'Empleados':
        this.dismiss();
        this.router.navigateByUrl(environment.paginaEmpleados);
        //this.navCtrl.navigateForward(environment.paginaEmpleados);
        break;
    }
  }

  onSubmit() {
    console.log('enviar');
    if (this.credencialesForma.valid) {
      this.usuario = this.credencialesForma.get('usuario')?.value;
      this.contrasenia = this.credencialesForma.get('contrasenia')?.value;
      console.log('usuario:', this.usuario);
      console.log('contrasenia:', this.contrasenia);
      let usuario: Usuario = new Usuario;
      usuario.usuario = this.usuario;
      usuario.contrasenia = EncriptarDesencriptar.encrypt(this.contrasenia);
      this.configuracionSvc.leeConfiguracionUsuario(usuario).subscribe({
        next: (response: any) => {
          let existe: boolean = response.existe;
          console.log('existe:', existe);
          if (existe) {
            this.irA();
          } else {
            console.log('Incorrecto, entonces, dar nuevamente las credenciales');
            this.mensajeErrorLogin();
          }
        },
        error: (error: any) => {
          console.log('Ocurrió un error al leer el usuario');
          console.log(error);
        }
      });
    }
  }

  async mensajeErrorLogin() {
    Mensajes.datosError(this.alertController, 'Datos incorrectos',
      'El usuario y/o la contraseña son incorrectos', this.credencialesForma);
  }

}
