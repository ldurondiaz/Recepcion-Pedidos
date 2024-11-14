import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PedidoNube } from '../../model/pedidoNube';
import { PedidosService } from '../../services/pedidos.service';
import { Sucursal } from '../../model/sucursal';
import { Administrador } from '../../model/administrador';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { Procesamiento } from '../../utils/procesamiento';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RelojComponent]
})
export class PedidosPage implements OnInit {
  pedidos!: PedidoNube[];
  sucursal!: Sucursal;
  administrador: Administrador;
  totalPedidosRecibidos: number = 0;

  constructor(private pedidosSvc: PedidosService) {
    this.administrador = Administrador.getInstance();
  }

  ngOnInit() {
    this.sucursal = this.administrador.getSucursal();
    console.log('this.sucursal->', this.sucursal);
    this.pedidosSvc.leerListaPedidosNube(this.sucursal.clave).subscribe({
      next: (response: any) => {
        this.pedidos = response;
        console.log('this.pedidos->', this.pedidos);
        this.totalPedidosRecibidos = this.pedidos.length;
        for (let index = 0; index < this.pedidos.length; index++) {
//          this.pedidos[index].fechaHora = Procesamiento.fechaHora(this.pedidos[index].fechaHora);
//          this.pedidos[index].datosCliente = Procesamiento.datosCliente(this.pedidos[index].datosCliente);
          this.pedidosSvc.insertarPedido(this.pedidos[index]).subscribe({
            next: (response: any) => {
              console.log('this.pedidos[index]===>', this.pedidos[index]);
              console.log('Pedido insertado de forma exitosa');
              console.log(response);
            },
            error: (error: any) => {
              console.log('Ocurrió un error al insertar los datos del pedido:');
              console.log(error);
            }
          });
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos:');
        console.log(error);
      }
    });
  }

}
