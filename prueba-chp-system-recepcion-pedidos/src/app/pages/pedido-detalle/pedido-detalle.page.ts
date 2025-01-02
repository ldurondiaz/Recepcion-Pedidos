import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../model/pedido';
import { PedidosService } from '../../services/pedidos.service';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonGrid, IonRow, IonCol, IonText, IonButton, IonInput } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';
import { Strings } from 'src/app/utils/strings';
import { Router } from '@angular/router';
import { EmpleadosService } from '../../services/empleados.service';
import { Empleado } from '../../model/empleado';
import { EncriptarDesencriptar } from '../../utils/encriptarDesencriptar';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.page.html',
  styleUrls: ['./pedido-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, RelojComponent,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
    IonGrid, IonRow, IonCol, IonText, IonButton, IonInput
  ]
})
export class PedidoDetallePage {
  empleado!: Empleado;
  pedido!: Pedido;
  textoBoton: string = '';
  isButtonEnabled: boolean = false;

  constructor(
    private pedidosSvc: PedidosService,
    private router: Router,
    private empleadosSvc: EmpleadosService
  ) { }

  ngOnInit() {
    this.pedido = history.state.data;
    if (this.pedido) {
      console.log('Pedido recibido==========>', this.pedido);
    } else {
      console.log('No se recibio el pedido.');
    }
    //los que son AP son los que se van a mostrar al dar clic en el botón historial
    console.log('LGDD 2->', this.pedido.estatus);
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
  }

  onChangeNip(nip_param: any) {
    console.log('entre a opChangeNip');
    const input = nip_param.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Permite solo números
    if (input.value.length === 3) {
      let empleado: Empleado = new Empleado;
      empleado.nip = EncriptarDesencriptar.encrypt(input.value);
      this.empleadosSvc.leerEmpleadoPorNip(empleado).subscribe({
        next: (response: any) => {
          this.empleado = response;
          console.log('this.empleado->', this.empleado);
        },
        error: (error: any) => {
          console.log('Ocurrió un error al cargar los datos del empleado:');
          console.log(error);
        }
      });
      this.isButtonEnabled = true;
    } else {
      this.isButtonEnabled = false;
    }
  }

  async onSubmit() {
    console.log('estoy en pedido detalle en onsubmit this.pedido:', this.pedido);
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
  }

  actualizaPedidoBDLocal(pedido: Pedido) {
    this.pedidosSvc.actualizarEstatusPedidoBDLocal(pedido).subscribe({
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

}
