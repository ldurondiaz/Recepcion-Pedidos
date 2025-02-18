import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButtons, IonButton, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { Administrador } from '../../model/administrador';
import { Sucursal } from '../../model/sucursal';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RelojComponent]
})
export class HistorialPage implements OnInit {
  administrador: Administrador;
  sucursal!: Sucursal;

  constructor() {
    this.administrador = Administrador.getInstance();
   }

  ngOnInit() {
    console.log('ESTOY EN PEDIDOS ngOnInit');
    this.sucursal = this.administrador.getSucursal();
  }

}
