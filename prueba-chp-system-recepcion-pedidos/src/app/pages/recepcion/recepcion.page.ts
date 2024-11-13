import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PedidoNube } from '../../model/pedidoNube';
import { RecepcionService } from '../../services/recepcion.service';
import { Sucursal } from '../../model/sucursal';
import { Administrador } from '../../model/administrador';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { Procesamiento } from '../../utils/procesamiento';

@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.page.html',
  styleUrls: ['./recepcion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RelojComponent]
})
export class RecepcionPage implements OnInit {
  pedidos!: PedidoNube[];
  sucursal!: Sucursal;
  administrador: Administrador;
  totalPedidoRecibidos: number = 0;

  constructor(private recepcionSvc: RecepcionService) {
    this.administrador = Administrador.getInstance();
  }

  ngOnInit() {
    this.sucursal = this.administrador.getSucursal();
    console.log('this.sucursal->', this.sucursal);
    this.recepcionSvc.leerListaPedidosNube(this.sucursal.clave).subscribe({
      next: (response: any) => {
        this.pedidos = response;
        this.totalPedidoRecibidos = this.pedidos.length;
        for (let index = 0; index < this.pedidos.length; index++) {
          this.pedidos[index].fechaHora = Procesamiento.fechaHora(this.pedidos[index].fechaHora);
          this.pedidos[index].datosCliente = Procesamiento.datosCliente(this.pedidos[index].datosCliente);
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos:');
        console.log(error);
      }
    });
  }

}
