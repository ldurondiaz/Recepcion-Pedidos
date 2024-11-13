import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';
import { environment } from '../../../environments/environment';
import { SharedModule } from '../../shared/shared.module'
import { ConfiguracionService } from '../../services/configuracion.service';
import { Usuario } from '../../model/usuario';
import { Mensajes } from '../../utils/mensajes';
import { EncriptarDesencriptar } from 'src/app/utils/encriptarDesencriptar';
import { Administrador } from 'src/app/model/administrador';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, SharedModule]
})

export class LoginPage implements OnInit {

  administrador: Administrador;
  titulo: string = '';
  credencialesForma!: FormGroup;
  usuario: any = '';
  contrasenia: any = '';

  constructor(private fb: FormBuilder, private alertController: AlertController,
    private configuracionSvc: ConfiguracionService, private router: Router) {
    this.administrador = Administrador.getInstance();
    addIcons({ close });
    this.credencialesForma = this.fb.group({
      usuario: ['gerardo.diaz', Validators.required],
      contrasenia: ['123456', Validators.required]
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    this.titulo = this.administrador.getTitulo();
  }

  onSubmit() {
    if (this.credencialesForma.valid) {
      this.usuario = this.credencialesForma.get('usuario');
      this.contrasenia = this.credencialesForma.get('contrasenia');
      let usuario: Usuario = new Usuario;
      usuario.usuario = this.usuario.value;
      usuario.contrasenia = EncriptarDesencriptar.encrypt(this.contrasenia.value);
      console.log('usuario (antes del servicio)--->', usuario);
      this.configuracionSvc.leeConfiguracionUsuario(usuario).subscribe({
        next: (response: any) => {
          let existe: boolean = response.existe;
          console.log('existe:', existe);
          if (existe) {
            console.log('Correcto, entonces, ir a la página configuración');
            switch (this.titulo) {
              case environment.moduloRecepcion:
                console.log('navegar a: ', this.titulo);
                this.router.navigateByUrl(environment.paginaRecepcion);
                break;
              case environment.moduloConfiguracion:
                console.log('navegar a: ', this.titulo);
                this.router.navigateByUrl(environment.paginaConfiguracion);
                break;
              case environment.moduloEmpleados:
                console.log('navegar a: ', this.titulo);
                this.router.navigateByUrl(environment.paginaEmpleados);
                break;
            }
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
