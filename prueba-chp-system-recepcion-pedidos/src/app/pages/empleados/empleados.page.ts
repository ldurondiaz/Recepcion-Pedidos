import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, pencilOutline, trashOutline, pin, arrowForwardCircle, business } from 'ionicons/icons';
import { EmpleadoComponent } from '../../components/empleado/empleado.component';
import { EmpleadosService } from '../../services/empleados.service';
//import { SharedModule } from '../../shared/shared.module'
import { Administrador } from '../../model/administrador';
import { Empleado } from '../..//model/empleado';
import { Strings } from '../../utils/strings';
import { environment } from '../../../environments/environment';
import { RelojComponent } from '../../components/reloj/reloj.component';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, EmpleadoComponent, RelojComponent/*, SharedModule,*/
  ]
})
export class EmpleadosPage implements OnInit {

  presentingElement: any;
  administrador: Administrador;
  titulo: string = '';
  empleados!: Empleado[];

  constructor(private empleadoSvc: EmpleadosService, private modalController: ModalController) {
    addIcons({ addOutline, pencilOutline, trashOutline, pin, arrowForwardCircle, business });
    this.administrador = Administrador.getInstance();
  }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.leeListaEmpleados();
  }

  leeListaEmpleados() {
    this.empleadoSvc.leerListaEmpleados().subscribe({
      next: (response: any) => {
        this.empleados = response;
        if (this.empleados) {
          console.log('lista de empleados ->', this.empleados);
          for (let index = 0; index < this.empleados.length; index++) {
            this.empleados[index].fechaingreso = Strings.dateformatAAAAMMDDToDDMMAAAA(this.empleados[index].fechaingreso);
          }
        }
        else {
          console.log('Incorrecto, no se cargaron los datos de los empleados');
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los empleados:');
        console.log(error);
      }
    });
  }

  async agregar() {
    console.log('Agregar');
    this.administrador.setTitulo(environment.agregarEmpleado);

    // MODAL Actualiza la lista de empleados en la página.
    const modal = await this.modalController.create({
      component: EmpleadoComponent,
      presentingElement: this.presentingElement,
    });
    modal.onDidDismiss().then(() => {
      this.leeListaEmpleados();
    });
    await modal.present();
    // MODAL FIN
  }

  async editar(empleado: Empleado) {
    console.log('Editar', empleado);
    this.administrador.setTitulo(environment.editarEmpleado);
    this.administrador.setEmpleado(empleado);
    // MODAL Actualiza la lista de empleados en la página.
    const modal = await this.modalController.create({
      component: EmpleadoComponent,
      presentingElement: this.presentingElement,
    });
    modal.onDidDismiss().then(() => {
      this.leeListaEmpleados();
    });
    await modal.present();
    // MODAL FIN
  }

  async eliminar(empleado: Empleado) {
    console.log('Eliminar', empleado);
    this.administrador.setTitulo(environment.eliminarEmpleado);
    this.administrador.setEmpleado(empleado);
    // MODAL Actualiza la lista de empleados en la página.
    const modal = await this.modalController.create({
      component: EmpleadoComponent,
      presentingElement: this.presentingElement,
    });
    modal.onDidDismiss().then(() => {
      this.leeListaEmpleados();
    });
    await modal.present();
    // MODAL FIN
  }

}
