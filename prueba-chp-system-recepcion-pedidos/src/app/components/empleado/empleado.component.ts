import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Administrador } from '../../model/administrador';
import { Sucursal } from '../../model/sucursal';
import { EmpleadosService } from '../../services/empleados.service';
import { EmpleadoTipo } from '../../model/empleadotipo';
import { Empleado } from '../../model/empleado';
import { Uuid } from '../../utils/uuid';
import { environment } from '../../../environments/environment';
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
  administradorGetEmpleado!: Empleado;
  empleadoTipos!: EmpleadoTipo[];
  empleadoTipoId: string = '';
  estaActivo: boolean = true;
  empleadoForma!: FormGroup;
  mostrarEmpleadoForma: boolean = true;
  empleadoTipoTipo: string = '';

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

  ngOnInit() {
    this.titulo = this.administrador.getTitulo();
    console.log('this.titulo->', this.titulo);
    this.sucursal = this.administrador.getSucursal();
    console.log('this.sucursal->', this.sucursal);
    this.empleadosSvc.leerListaEmpleadosTipo().subscribe({
      next: (response: any) => {
        this.empleadoTipos = response;
        console.log(this.empleadoTipos
          ? 'empleado tipos--->' + this.empleadoTipos
          : 'Incorrecto, no se cargaron los datos de empleado tipos');
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de empleado tipos:');
        console.log(error);
      }
    });
    switch (this.titulo) {
      case environment.agregarEmpleado : this.mostrarEmpleadoForma = true; break;
      case environment.editarEmpleado  : this.mostrarEmpleadoForma = true; this.getEmpleado(); break;
      case environment.eliminarEmpleado: this.mostrarEmpleadoForma = false; this.getEmpleado(); break;
    }
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

  getEmpleado() {
    this.administradorGetEmpleado = this.administrador.getEmpleado();
    //this.idEmpleado = this.administrador.getEmpleado().id;
    this.empleadosSvc.leerEmpleado(this.administradorGetEmpleado).subscribe({
      next: (response: any) => {
        this.empleado = response;
        if (this.empleado) {
          this.nombre = this.empleado.nombre;
          this.domicilio = this.empleado.domicilio;
          this.telefono = this.empleado.telefono;
          this.fechaIngreso = (this.mostrarEmpleadoForma === true)
          ? Strings.dateformatAAAAMMDDToAAAA_MM_DD(Strings.dateformatAAAAMMDDToDDMMAAAA(this.empleado.fechaingreso))
          : Strings.dateformatAAAAMMDDToDDMMAAAA(this.empleado.fechaingreso);
          this.tipoIdSeleccionado = this.empleado.empleadotipoid;
          for (const tipo of this.empleadoTipos) {
            if (tipo.id === this.empleado.empleadotipoid) {
              this.empleadoTipoTipo = tipo.tipo;
              break;
            }
          }
          this.estaActivoSeleccionado = this.empleado.activo;
          this.nip = EncriptarDesencriptar.decrypt(this.empleado.nip);
          this.empleadoForma.get('nombre')?.setValue(this.nombre);
          this.empleadoForma.get('domicilio')?.setValue(this.domicilio);
          this.empleadoForma.get('telefono')?.setValue(this.telefono);
          this.empleadoForma.get('fechaIngreso')?.setValue(this.fechaIngreso);
          this.empleadoForma.get('tipo')?.setValue(this.tipoIdSeleccionado);
          this.estaActivo = this.estaActivoSeleccionado === environment.si_bd ? true : false;
          this.empleadoForma.get('nip')?.setValue(this.nip);
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

  insertarEmpleado() {
    let empleado: Empleado = new Empleado;
    empleado.id = Uuid.generaId();
    empleado.claveSucursal = this.sucursal.clave;
    empleado.nombre = this.empleadoForma.value.nombre;
    empleado.domicilio = this.empleadoForma.value.domicilio;
    empleado.telefono = this.empleadoForma.value.telefono;
    empleado.fechaingreso = Strings.deleteCharacter(this.empleadoForma.value.fechaIngreso);
    empleado.empleadotipoid = this.empleadoTipoId;
    empleado.activo = this.estaActivo === true ? environment.si_bd : environment.no_bd;
    empleado.nip = EncriptarDesencriptar.encrypt(this.empleadoForma.value.nip);
    empleado.baja = environment.no_bd;
    this.empleadosSvc.insertarEmpleado(empleado).subscribe({
      next: (response: any) => {
        console.log('El empleado se insertó de forma exitosa')
        if (response) {
          Mensajes.datosCorrectosModal(this.alertController, 'Datos registrados', 'Se han registrado los datos del empleado',
            this.empleadoForma, this.modalController, this.router, environment.paginaEmpleados);
            // MODAL
            this.modalController.dismiss();
            // MODAL FIN
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
  }

  editarEmpleado() {
    let empleado: Empleado = new Empleado;
    empleado.id = this.administradorGetEmpleado.id;
    empleado.claveSucursal = this.sucursal.clave;
    empleado.nombre = this.empleadoForma.value.nombre;
    empleado.domicilio = this.empleadoForma.value.domicilio;
    empleado.telefono = this.empleadoForma.value.telefono;
    empleado.fechaingreso = Strings.deleteCharacter(this.empleadoForma.value.fechaIngreso);
    empleado.empleadotipoid = this.tipoIdSeleccionado;
    empleado.activo = this.estaActivo === true ? environment.si_bd : environment.no_bd;
    empleado.nip = EncriptarDesencriptar.encrypt(this.empleadoForma.value.nip);
    console.log('Empleado Edita:', empleado);
    this.empleadosSvc.actualizarEmpleado(empleado).subscribe({
      next: (response: any) => {
        console.log('Empleado editado de forma exitosa');
        if (response) {
          // MODAL
          this.modalController.dismiss();
          // MODAL FIN
          Mensajes.datosCorrectosModal(this.alertController, 'Datos editados', 'Se han editado los datos del empleado',
            this.empleadoForma, this.modalController, this.router, environment.paginaEmpleados);
        }
        else {
          console.log('Incorrecto, no se editaron los datos del empleado');
        }
      },
      error: (error: any) => {
        console.log('Error en la edición del empleado');
        console.log(error);
      },
    });
  }

  async eliminarEmpleado() {
    let empleado: Empleado = new Empleado;
    empleado.id = this.administradorGetEmpleado.id;
    this.empleadosSvc.eliminarEmpleado(empleado).subscribe({
      next:(response:any)=>{
        console.log('Empleado eliminado de forma exitosa')
        console.log(response);
        Mensajes.datosCorrectosModal(this.alertController, 'Datos eliminados', 'Se han eliminado los datos del empleado',
          this.empleadoForma, this.modalController, this.router, environment.paginaEmpleados);
        this.modalController.dismiss();
        this.router.navigateByUrl(environment.paginaEmpleados);
      },
      error:(error:any)=>{
        console.log('Error en eliminar al empleaado')
        console.log(error)
      }
    });
  }

  onSubmit() {
    if (this.empleadoForma.valid) {
      switch (this.titulo) {
        case environment.agregarEmpleado: this.insertarEmpleado(); break;
        case environment.editarEmpleado: this.editarEmpleado(); break;
        case environment.eliminarEmpleado: this.eliminarEmpleado(); break;
      }
    } else {
      Mensajes.datosError(this.alertController, 'Datos incompletos',
        'Debe de capturar todos los datos del empleado', this.empleadoForma);
    }
  }

}
