import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Pedido } from '../../model/pedido';
import { PedidosService } from '../../services/pedidos.service';
import { Sucursal } from '../../model/sucursal';
import { Administrador } from '../../model/administrador';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { environment } from 'src/environments/environment';
import { Strings } from 'src/app/utils/strings';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RelojComponent]
})
export class PedidosPage implements OnInit {
  pedidos!: Pedido[];
  pedidosRecibidos!: Pedido[];
  sucursal!: Sucursal;
  administrador: Administrador;
  totalPedidos: number = 0;
  totalPedidosRecibidos: number = 0;
  totalPedidosCapturados: number = 0;
  totalPedidosEnviados: number = 0;
  totalPedidosListos: number = 0;

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
        this.totalPedidos = this.pedidos.length;
        for (let index = 0; index < this.totalPedidos; index++) {
          this.pedidos[index].estatus = environment.estatusRecibePedido;
          console.log('this.pedidos[index].estatus:', this.pedidos[index].estatus);
          this.pedidos[index].fechaRecibido = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
          console.log('this.pedidos[index].fechaRecibido:', this.pedidos[index].fechaRecibido);
          this.pedidosSvc.insertarPedido(this.pedidos[index]).subscribe({
            next: (response: any) => {
              console.log('this.pedidos[index]===>', this.pedidos[index]);
              console.log('Pedido insertado de forma exitosa');
              console.log(response);
              this.pedidosSvc.actualizarPedidoNube(this.pedidos[index]).subscribe({
                next: (response: any) => {
                  console.log('this.pedidos[index]===>', this.pedidos[index]);
                  console.log('Pedido actualizado de forma exitosa');
                  console.log(response);
                },
                error: (error: any) => {
                  console.log('Ocurrió un error al actualizar los datos del pedido:');
                  console.log(error);
                }
              });
            },
            error: (error: any) => {
              console.log('Ocurrió un error al insertar los datos del pedido:');
              console.log(error);
            }
          });
        }
        //this.totalPedidosRecibidos = 0;
        this.totalPedidosRecibidos = this.totalPedidos;
        //this.pedidosRecibidos = [];
        this.pedidosRecibidos = this.pedidos;
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos:');
        console.log(error);
      }
    });
  }

}
