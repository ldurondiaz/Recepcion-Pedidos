import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../model/pedido';
import { PedidosService } from '../../services/pedidos.service';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonGrid, IonRow, IonCol, IonText, IonButton } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.page.html',
  styleUrls: ['./pedido-detalle.page.scss'],
  standalone: true,
  imports: [CommonModule, RelojComponent,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
    IonGrid, IonRow, IonCol, IonText, IonButton
  ]
})
export class PedidoDetallePage /*implements OnInit*/ {
  pedido!: Pedido;
  textoBoton: string = '';

  constructor(private pedidosSvc: PedidosService) { }

  ngOnInit() {
    this.pedido = history.state.data;
    console.log('this.pedido->', this.pedido);
    //this.pedido.estatus = 'CP';
    //los que son AP son los que se van a mostrar al dar clic en el botón histrial
    console.log('LGDD 2->', this.pedido.estatus);
    switch (this.pedido.estatus) {
      case environment.estatusRecibePedido:
      this.textoBoton = environment.textoBotonCapturaPedido; break;
      case environment.estatusCapturaPedido:
      this.textoBoton = environment.textoBotonEnviaPedido; break;
      case environment.estatusEnviaPedido:
      this.textoBoton = environment.textoBotonListoPedido; break;
      case environment.estatusListoPedido:
      this.textoBoton = environment.textoBotonAtendidoPedido; break;
    }
    if (this.pedido) {
      console.log('Pedido recibido:', this.pedido);
    } else {
      console.log('No se recibio el pedido.');
    }
  }

  onSubmit() {
    console.log('this.pedido.estatus:',this.pedido.estatus);
/*    switch (this.titulo) {
      case environment.agregarEmpleado: this.insertarEmpleado(); break;
      case environment.editarEmpleado: this.editarEmpleado(); break;
      case environment.eliminarEmpleado: this.eliminarEmpleado(); break;
    }*/
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

}
