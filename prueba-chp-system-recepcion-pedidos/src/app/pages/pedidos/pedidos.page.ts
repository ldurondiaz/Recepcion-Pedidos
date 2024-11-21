import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Pedido } from '../../model/pedido';
import { PedidosService } from '../../services/pedidos.service';
import { Sucursal } from '../../model/sucursal';
import { Administrador } from '../../model/administrador';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { environment } from 'src/environments/environment';
import { Strings } from 'src/app/utils/strings';
import { Procesamiento } from 'src/app/utils/procesamiento';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonGrid, IonRow, IonCol, IonItem, IonChip, IonLabel, IonText,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonAccordionGroup, IonAccordion } from '@ionic/angular/standalone';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [CommonModule, RelojComponent,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
    IonGrid, IonRow, IonCol, IonItem, IonChip, IonLabel, IonText,
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
    IonAccordionGroup, IonAccordion
  ]
})
export class PedidosPage implements OnInit {
  pedidos!: Pedido[];
  pedidosRecibidos!: Pedido[];
  sucursal!: Sucursal;
  administrador: Administrador;

  totalPedidosCapturados: number = 0;
  totalPedidosEnviados: number = 0;
  totalPedidosListos: number = 0;

  constructor(private pedidosSvc: PedidosService, private router: Router) {
    this.administrador = Administrador.getInstance();
  }

  leerPedidosNube() {
    this.pedidos = [];
    this.pedidosSvc.leerListaPedidosNube(this.sucursal.clave).subscribe({
      next: (response: any) => {
        this.pedidos = response;
        console.log('this.pedidos:', this.pedidos);
        for(let pedido of this.pedidos) {
          pedido.estatus = environment.estatusRecibePedido;
          pedido.fechaRecibido = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
          this.pedidosSvc.insertarPedido(pedido).subscribe({
            next: (response: any) => {
              console.log(response);
              this.pedidosSvc.actualizarPedidoNube(pedido).subscribe({
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
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos:');
        console.log(error);
      }
    });
  }

  leerPedidosRecibidos() {
    this.pedidosRecibidos = [];
    this.pedidosSvc.leerListaPedidos(this.sucursal.clave, environment.estatusRecibePedido).subscribe({
      next: (response: any) => {
        this.pedidosRecibidos = response;
        console.log('this.pedidosRecibidos:', this.pedidosRecibidos);
        for (let pedidoRecibido of this.pedidosRecibidos) {
          pedidoRecibido.fechaHoraVista = Procesamiento.fechaHora(pedidoRecibido.fechaHora);
          pedidoRecibido.datosClienteVista = Procesamiento.datosCliente(pedidoRecibido.datosCliente);
          pedidoRecibido.datosDomicilioClienteVista = Procesamiento.datosVariosRenglones(pedidoRecibido.datosDomicilioCliente);
          pedidoRecibido.detallePedidoVista = Procesamiento.datosVariosRenglones(pedidoRecibido.detallePedido);
          pedidoRecibido.instruccionesEspecialesVista = Procesamiento.datosVariosRenglones(pedidoRecibido.instruccionesEspeciales);
          pedidoRecibido.promocionesAplicadasVista = Procesamiento.datosVariosRenglones(pedidoRecibido.promocionesAplicadas);
          pedidoRecibido.tipoPagoVista = Procesamiento.tipoPago(pedidoRecibido.tipoPago);
          pedidoRecibido.modalidadEntregaVista = Procesamiento.modalidadEntrega(pedidoRecibido.modalidadEntrega);
          pedidoRecibido.estatusVista = Procesamiento.estatus(pedidoRecibido.estatus);
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos:');
        console.log(error);
      }
      });
  }

  ngOnInit() {
    this.sucursal = this.administrador.getSucursal();
    this.leerPedidosNube();
    this.leerPedidosRecibidos();
  }

  onClick(pedidoRecibido_param: Pedido) {
    this.router.navigateByUrl(environment.paginaPedidoDetalle, { state: { data: pedidoRecibido_param } });
  }
}
