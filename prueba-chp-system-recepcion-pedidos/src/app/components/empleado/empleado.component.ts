import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Administrador } from '../../model/administrador';
import { Sucursal } from '../../model/sucursal';
import { EmpleadosService } from '../../services/empleados.service';
import { EmpleadoTipo } from '../../model/empleadotipo';
import { Empleado } from '../../model/empleado';
import { Utils } from '../../utils/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})

export class EmpleadoComponent implements OnInit {

  administrador: Administrador;
  titulo: string = '';
  sucursal!: Sucursal;
  empleadoTipos!: EmpleadoTipo[];
  empleadoTipoId: string = '';
  estaActivo: boolean = true;
  empleadoForma!: FormGroup;

  constructor(private modalController: ModalController, private fb: FormBuilder,
    private EmpleadosSvc: EmpleadosService) {
    this.administrador = Administrador.getInstance();
    this.empleadoForma = this.fb.group({
      'nombre': new FormControl("", Validators.required),
      'domicilio': new FormControl("", Validators.required),
      'telefono': new FormControl("", [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d{10}$/)]),
      'fechaIngreso': new FormControl("", Validators.required),
      'tipo': new FormControl("", Validators.required),
      'activo': new FormControl(""/*, Validators.required*/),
      'nip': new FormControl("", [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d{3}$/)]),
//      'baja': new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
    this.titulo = this.administrador.getTitulo();
    console.log('this.titulo->', this.titulo);
    this.sucursal = this.administrador.getSucursal();
    console.log('this.sucursal->', this.sucursal);
    this.EmpleadosSvc.leeListaEmpleadosTipo().subscribe({
      next: (response: any) => {
        this.empleadoTipos = response;
        if (this.empleadoTipos) {
          console.log('empleado tipos--->', this.empleadoTipos);
        }
        else {
          console.log('Incorrecto, no se cargaron los datos de empleado tipos');
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de empleado tipos:');
        console.log(error);
      }
    });
  }

  getEmpleadoTipo(empleadoTipoId_param: any) {
    this.empleadoTipoId = empleadoTipoId_param.detail.value;
  }

  onActivo(event: any) {
    this.estaActivo = event.detail.checked;
//    console.log('Toggle is:', this.isChecked); // Muestra el valor actual
  }

  dismiss() {
    this.modalController.dismiss();
  }

  onSubmit() {
    console.log('enviar');
    if (this.empleadoForma.valid) {
      let empleado: Empleado = new Empleado;
      empleado.id = Utils.generaId();
      empleado.claveSucursal = this.sucursal.clave;
      empleado.nombre = this.empleadoForma.value.nombre;
      empleado.domicilio = this.empleadoForma.value.domicilio;
      empleado.telefono = this.empleadoForma.value.telefono;
      empleado.fechaingreso = this.empleadoForma.value.fechaIngreso;
      empleado.empleadoTipoId = this.empleadoTipoId;
      empleado.activo = this.estaActivo === true ? environment.si_bd : environment.no_bd;
      empleado.nip = this.empleadoForma.value.nip;
      empleado.baja = environment.no_bd;
      console.log('Empleado Alta:', empleado);
    }
  }

}
