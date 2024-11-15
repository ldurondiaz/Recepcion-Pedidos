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
import { Procesamiento } from 'src/app/utils/procesamiento';

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
    this.pedidos = [];
    this.pedidosSvc.leerListaPedidosNube(this.sucursal.clave).subscribe({
      next: (response: any) => {
        this.pedidos = response;
        this.totalPedidos = this.pedidos.length;
        for (let index = 0; index < this.totalPedidos; index++) {
          this.pedidos[index].estatus = environment.estatusRecibePedido;
          this.pedidos[index].fechaRecibido = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
          this.pedidosSvc.insertarPedido(this.pedidos[index]).subscribe({
            next: (response: any) => {
              console.log(response);
              this.pedidosSvc.actualizarPedidoNube(this.pedidos[index]).subscribe({
                next: (response: any) => {
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
        /*Lee lista de pedidos locales*/
        this.pedidosRecibidos = [];
        this.pedidosSvc.leerListaPedidos(this.sucursal.clave, environment.estatusRecibePedido).subscribe({
          next: (response: any) => {
            this.pedidosRecibidos = response;
            this.totalPedidosRecibidos = this.pedidosRecibidos.length;
            for (let index = 0; index < this.totalPedidosRecibidos; index++) {
              this.pedidosRecibidos[index].fechaHora = Procesamiento.fechaHora(this.pedidosRecibidos[index].fechaHora);
              this.pedidosRecibidos[index].datosCliente = Procesamiento.datosCliente(this.pedidosRecibidos[index].datosCliente);
            }
          },
          error: (error: any) => {
            console.log('Ocurrió un error al cargar los datos de los pedidos locales:');
            console.log(error);
          }
        });
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos:');
        console.log(error);
      }
    });
  }

}
