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
  intervalId: any;
  num: number = 0;
  pedidos: Pedido[] = [];
  pedidosRecibidos!: Pedido[];
  sucursal!: Sucursal;
  administrador: Administrador;

  totalPedidosRecibidos: number = 0;
  totalPedidosCapturados: number = 0;
  totalPedidosEnviados: number = 0;
  totalPedidosListos: number = 0;

  constructor(private pedidosSvc: PedidosService, private router: Router) {
    this.administrador = Administrador.getInstance();
  }

  ngOnInit() {
    this.sucursal = this.administrador.getSucursal();
    //Cargar pedidos pendientes de la base de datos local
    this.leerPedidosPendientesBDLocal();
    // Llamar a leerPedidosNube() cada 10 segundos
    this.intervalId = setInterval(() => {
      console.log('lectura #', this.num);
      this.leerPedidosNubeServidor();
      this.num++;
    }, 5000); // 5000 ms = 5 segundos
  }

  ngOnDestroy() {
    // Limpiar el intervalo cuando el componente se destruya para evitar fugas de memoria
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  leerPedidosPendientesBDLocal() {
    this.pedidosSvc.leerPedidosPendientesBDLocal(this.sucursal.clave, environment.estatusRecibePedido).subscribe({
      next: (response: any) => {
        this.pedidos = response;
        console.log('this.pedidos=====>', this.pedidos);
        for (let i = 0; i < this.pedidos.length; i++) {
          console.log('typeof:', typeof this.pedidos[i].montoTotal); // Verifica el tipo
          console.log('inspecciona:', this.pedidos[i].montoTotal); // Inspecciona el valor
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos:');
        console.log(error);
      }
    });
  }

  leerPedidosNubeServidor() {
    this.pedidosSvc.leerPedidosNubeServidor(this.sucursal.clave).subscribe({
      next: (response: any) => {
        if (JSON.stringify(this.pedidos) !== JSON.stringify(response)) {
          let pedidosNube = response;
          for (let pn of pedidosNube) {
            let pnType: Pedido = pn;
            pnType.estatus = environment.estatusRecibePedido;
            this.insertaPedidoBDLocal(pnType);
            this.pedidos.push(pnType);
          }
          console.log('termine de leer los pedidos.');
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al leer los datos de los pedidos en la nube:');
        console.log(error);
      }
    });
  }

  insertaPedidoBDLocal(pedido: Pedido) {
    this.pedidosSvc.insertarPedidoBDLocal(pedido).subscribe({
      next: (response: any) => {
        this.actualizaPedidoBDServidor(pedido);
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al insertar los datos del pedido:');
        console.log(error);
      }
    });
  }

  actualizaPedidoBDServidor(pedido: Pedido) {
    this.pedidosSvc.actualizarPedidoNubeServidor(pedido).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al actualizar los datos del pedido:');
        console.log(error);
      }
    });
  }

  onClick(pedidoRecibido_param: Pedido) {
    this.router.navigateByUrl(environment.paginaPedidoDetalle, { state: { data: pedidoRecibido_param } });
  }

}
