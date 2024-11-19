import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Pedido } from '../../model/pedido';
import { RelojComponent } from '../../components/reloj/reloj.component';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.page.html',
  styleUrls: ['./pedido-detalle.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RelojComponent]
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
