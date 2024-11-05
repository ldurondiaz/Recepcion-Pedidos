import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, pencilOutline, trashOutline, pin, arrowForwardCircle, business } from 'ionicons/icons';
import { EmpleadoComponent } from '../../components/empleado/empleado.component';
import { EmpleadosService } from '../../services/empleados.service';
//import { SharedModule } from '../../shared/shared.module'
import { Administrador } from '../../model/administrador';
import { Empleado } from '../..//model/empleado';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, EmpleadoComponent/*, SharedModule,*/
  ]
})
export class EmpleadosPage implements OnInit {

  presentingElement: any;
  administrador: Administrador;
  titulo: string = '';
  empleados!: Empleado[];

  constructor(private empleadoSvc: EmpleadosService) {
    addIcons({ addOutline, pencilOutline, trashOutline, pin, arrowForwardCircle, business });
    this.administrador = Administrador.getInstance();
  }

  ngOnInit() {
    this.presentingElement = document.querySelector('.ion-page');
    this.empleadoSvc.leeListaEmpleados().subscribe({
      next: (response: any) => {
        this.empleados = response;
        if (this.empleados) {
          console.log('lista de empleados ->', this.empleados);
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

  agregar() {
    console.log('Agregar');
    this.administrador.setTitulo('Agregar Empleado');
  }

  editar(empleado: Empleado) {
    console.log('Editar', empleado);
    this.administrador.setTitulo('Editar Empleado');
  }

  eliminar(empleado: Empleado) {
    console.log('Eliminar', empleado);
    this.administrador.setTitulo('Eliminar Empleado');
  }

}
