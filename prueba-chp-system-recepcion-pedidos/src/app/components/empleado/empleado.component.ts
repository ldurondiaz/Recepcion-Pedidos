import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Administrador } from '../../model/administrador';
import { Sucursal } from '../../model/sucursal';
import { EmpleadosService } from '../../services/empleados.service';
import { EmpleadoTipo } from '../../model/empleadotipo';
import { Empleado } from '../../model/empleado';
import { Utils } from '../../utils/utils';
import { environment } from 'src/environments/environment';
import { Mensajes } from '../../utils/mensajes';
import { Strings } from '../../utils/strings';
import { EncriptarDesencriptar } from '../../utils/encriptarDesencriptar';

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

  empleado!: Empleado;
  nombre: string = '';
  domicilio: string = '';
  telefono: string = '';
  fechaIngreso: string = '';
  tipoIdSeleccionado: string = '';
  estaActivoSeleccionado: string = '';
  nip: string = '';

  constructor(private modalController: ModalController, private fb: FormBuilder,
    private empleadosSvc: EmpleadosService,
    private alertController: AlertController, private router: Router) {
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

  getEmpleado() {
    console.log('this.administrador.getEmpleado().id--->', this.administrador.getEmpleado().id);
    this.empleadosSvc.leeEmpleado(this.administrador.getEmpleado().id).subscribe({
      next: (response: any) => {
        this.empleado = response;
        if (this.empleado) {
          console.log('empleado--->', this.empleado);
          this.nombre = this.empleado.nombre;
          this.domicilio = this.empleado.domicilio;
          this.telefono = this.empleado.telefono;
          this.fechaIngreso = Strings.dateformatAAAAMMDDToAAAA_MM_DD(this.administrador.getEmpleado().fechaingreso);
          this.tipoIdSeleccionado = this.empleado.empleadotipoid;
          this.estaActivoSeleccionado = this.empleado.activo;
          this.estaActivo = this.estaActivoSeleccionado === environment.si_bd ? true : false;
          this.nip = EncriptarDesencriptar.decrypt(this.empleado.nip);
        }
        else {
          console.log('Incorrecto, no se cargaron los datos del empleado');
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos del empleado:');
        console.log(error);
      }
    });
  }

  ngOnInit() {
    this.titulo = this.administrador.getTitulo();
    console.log('this.titulo->', this.titulo);
    if (this.titulo === 'Editar Empleado') {
      this.getEmpleado();
    }
    this.sucursal = this.administrador.getSucursal();
    console.log('this.sucursal->', this.sucursal);
    this.empleadosSvc.leeListaEmpleadosTipo().subscribe({
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
      empleado.fechaingreso = Strings.deleteCharacter(this.empleadoForma.value.fechaIngreso);
      empleado.empleadotipoid = this.empleadoTipoId;
      empleado.activo = this.estaActivo === true ? environment.si_bd : environment.no_bd;
      empleado.nip = EncriptarDesencriptar.encrypt(this.empleadoForma.value.nip);
      empleado.baja = environment.no_bd;
      console.log('Empleado Alta:', empleado);
      this.empleadosSvc.insertaEmpleado(empleado).subscribe({
        next: (response: any) => {
          console.log('El empleado se insertó de forma exitosa')
          if (response) {
            Mensajes.datosCorrectosModal(this.alertController, 'Datos registrados', 'Se han registrado los datos del empleado',
              this.empleadoForma, this.modalController, this.router, environment.paginaEmpleados);
          }
          else {
            console.log('Incorrecto, no se insertó los datos del empleado');
          }
        },
        error: (error: any) => {
          console.log('Ocurrió un error al insertar los datos del empleado:');
          console.log(error);
        }
      });
    } else {
      Mensajes.datosError(this.alertController, 'Datos incompletos',
        'Debe de capturar todos los datos del empleado', this.empleadoForma);
    }
  }

}
