import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pedido } from '../../model/pedido';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonGrid, IonRow, IonCol, IonText, IonButton } from '@ionic/angular/standalone';

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
export class PedidoDetallePage implements OnInit {
  pedidoRecibido!: Pedido;

  constructor() { }

  ngOnInit() {
    this.pedidoRecibido = history.state.data;
    if (this.pedidoRecibido) {
      console.log('Pedido recibido:', this.pedidoRecibido);
    } else {
      console.log('No se recibio el pedido.');
    }
  }

}
