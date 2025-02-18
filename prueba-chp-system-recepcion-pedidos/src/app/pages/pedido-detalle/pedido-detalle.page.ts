import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../model/pedido';
import { PedidosService } from '../../services/pedidos.service';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonGrid, IonRow, IonCol, IonText, IonButton, IonInput, IonIcon } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { Strings } from 'src/app/utils/strings';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados.service';
import { Empleado } from '../../model/empleado';
import { EncriptarDesencriptar } from '../../utils/encriptarDesencriptar';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Mensajes } from '../../utils/mensajes';
import { AlertController } from '@ionic/angular/standalone';
import { Administrador } from '../../model/administrador';
import { Sucursal } from '../../model/sucursal';
import { addIcons } from 'ionicons';
import { timerOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.page.html',
  styleUrls: ['./pedido-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, RelojComponent, CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
    IonGrid, IonRow, IonCol, IonText, IonButton, IonInput, IonIcon
  ]
})
export class PedidoDetallePage implements OnInit {
  empleado!: Empleado;
  pedido!: Pedido;
  pL!: Pedido;
  textoBoton: string = '';
  nipForma!: FormGroup;
  administrador: Administrador;
  sucursal!: Sucursal;

  constructor(
    private pedidosSvc: PedidosService,
    private router: Router,
    private empleadosSvc: EmpleadosService,
    private fb: FormBuilder,
    private alertController: AlertController
  ) {
    this.administrador = Administrador.getInstance();
    this.nipForma = this.fb.group({
      'nip': new FormControl("", [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d{3}$/)])
    });
  }

  ngOnInit() {
    let pedidoHistory = history.state.data;
    this.pedido = new Pedido(pedidoHistory.idPedido, pedidoHistory.numeroPedido, pedidoHistory.idCliente, pedidoHistory.datosCliente,
      pedidoHistory.idDomicilioCliente, pedidoHistory.datosDomicilioCliente, pedidoHistory.claveSucursal,
      pedidoHistory.datosSucursal, pedidoHistory.fechaHora, pedidoHistory.tiempoEspera, pedidoHistory.estatus, pedidoHistory.modalidadEntrega,
      pedidoHistory.montoTotal, pedidoHistory.detallePedido, pedidoHistory.instruccionesEspeciales, /*pedidoHistory.promocionesAplicadas,*/
      pedidoHistory.tipoPago, pedidoHistory.cantidadProductos, pedidoHistory.resumenPedido, pedidoHistory.urlReciboPago
      /*pedidoHistory.montoSubtotal, pedidoHistory.montoDescuento*/);
    if (this.pedido) {
      this.sucursal = this.administrador.getSucursal();
      console.log('Pedido recibido==========>', this.pedido);
    //los que son AP son los que se van a mostrar al dar clic en el botón historial
    if (this.pedido.estatus === environment.estatusRecibePedido) {
      this.textoBoton = environment.textoBotonCapturaPedido;
    } else
    if (this.pedido.estatus === environment.estatusCapturaPedido
      && this.pedido.modalidadEntrega === environment.entregaDomicilio) {
      this.textoBoton = environment.textoBotonEnviaPedido;
    } else
    if (this.pedido.estatus === environment.estatusCapturaPedido
      && this.pedido.modalidadEntrega === environment.entregaSucursal) {
      this.textoBoton = environment.textoBotonListoPedido;
    } else
    if (this.pedido.estatus === environment.estatusEnviaPedido
      || this.pedido.estatus === environment.estatusListoPedido
    ) {
      this.textoBoton = environment.textoBotonAtendidoPedido;
    }
    } else {
      console.log('No se recibio el pedido.');
    }
  }

  onSubmit() {
    if (this.nipForma.valid) {
      let nip: any = this.nipForma.get('nip');
      console.log('nip:', nip.value);
      let empleado: Empleado = new Empleado;
      empleado.nip = EncriptarDesencriptar.encrypt(nip.value);
      this.empleadosSvc.leerEmpleadoPorNip(empleado).subscribe({
        next: async (response: any) => {
          this.empleado = response;
          console.log('this.empleado->', this.empleado);
          //console.log('this.empleado nip->', this.empleado.nip);
          if (this.empleado !== null) {
            if (this.pedido.estatus === environment.estatusRecibePedido) {
              this.pedido.estatus = environment.estatusCapturaPedido;
              this.pedido.fechaCapturado = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
              this.pedido.idEmpleadoFechaCapturado = this.empleado.id;
            } else
            if (this.pedido.estatus === environment.estatusCapturaPedido
              && this.pedido.modalidadEntrega === environment.entregaDomicilio) {
                this.pedido.estatus = environment.estatusEnviaPedido;
                this.pedido.fechaEnviado = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
                this.pedido.idEmpleadoFechaEnviado = this.empleado.id;
            } else
            if (this.pedido.estatus === environment.estatusCapturaPedido
              && this.pedido.modalidadEntrega === environment.entregaSucursal) {
                this.pedido.estatus = environment.estatusListoPedido;
                this.pedido.fechaListo = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
                this.pedido.idEmpleadoFechaListo = this.empleado.id;
            } else
            if (this.pedido.estatus === environment.estatusEnviaPedido
              || this.pedido.estatus === environment.estatusListoPedido
            ) {
              this.pedido.estatus = environment.estatusAtendidoPedido;
              this.pedido.fechaAtendido = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
              this.pedido.idEmpleadoFechaAtendido = this.empleado.id;
            }
            this.actualizaPedidoBDLocal(this.pedido);
            this.actualizaPedidoBDServidor(this.pedido);
            await new Promise((f) => setTimeout(f, 500));
            this.router.navigateByUrl(environment.paginaPedidos);
            this.router.navigateByUrl(environment.paginaPedidos, { state: { data: this.pedido } });
          } else {
            console.log('no existe el empleado');
            this.mensajeErrorNip();
          }
        },
        error: (error: any) => {
          console.log('Ocurrió un error al cargar los datos del empleado:');
          console.log('Ocurrió un error el nip del empleado no existe:');
          console.log(error);
          this.mensajeErrorNip();
        }
      });
    }
  }

  actualizaPedidoBDLocal(pedido: Pedido) {
    this.pedidosSvc.actualizarEstatusPedidoBDLocalPedido(pedido).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al actualizar los datos del pedido:');
        console.log(error);
      }
    });
  }

  actualizaPedidoBDServidor(pedido: Pedido) {
    this.pedidosSvc.actualizarEstatusPedidoNubeServidor(pedido).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al actualizar los datos del pedido:');
        console.log(error);
      }
    });
  }

  mensajeErrorNip() {
    Mensajes.datosError(this.alertController, 'Datos incorrectos',
      'El nip es incorrecto', this.nipForma);
  }

}
