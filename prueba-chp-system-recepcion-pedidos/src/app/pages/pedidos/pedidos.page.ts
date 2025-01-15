import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Pedido } from '../../model/pedido';
import { PedidosService } from '../../services/pedidos.service';
import { Sucursal } from '../../model/sucursal';
import { Administrador } from '../../model/administrador';
import { environment } from 'src/environments/environment';
import { IonSpinner, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent,
  IonGrid, IonRow, IonCol, IonItem, IonChip, IonLabel, IonText,
  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent,
  IonAccordionGroup, IonAccordion } from '@ionic/angular/standalone';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { ChangeDetectorRef } from '@angular/core';
import { Strings } from 'src/app/utils/strings';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonChip,
    IonLabel,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonAccordionGroup,
    IonAccordion,
    RelojComponent
  ],
})
export class PedidosPage implements OnInit, OnDestroy {
  intervalId: any;
  //pedidos: Pedido[] = [];
  pedidosRP: Pedido[] = [];
  pedidosCP: Pedido[] = [];
  pedidosEP: Pedido[] = [];
  pedidosLP: Pedido[] = [];
  administrador: Administrador;
  sucursal!: Sucursal;
  pedidoGroups: any[] = [];
  nombreSucursal: string = '';

  showSpinner!: boolean;

  constructor(
    private pedidosSvc: PedidosService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.administrador = Administrador.getInstance();
  }

  ngOnInit() {
    console.log('ESTOY EN PEDIDOS ngOnInit');
    this.sucursal = this.administrador.getSucursal();
    this.leerPedidosPendientesBDLocal();
    this.intervalId = setInterval(() => {
      this.leerPedidosNubeServidor();
      this.leerPedidosPendientesBDLocal();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  ionViewWillEnter() {
    console.log('ESTOY EN PEDIDOS ionViewWillEnter');
    this.leerPedidosPendientesBDLocal();
  }

  leerPedidosPendientesBDLocal() {
    this.showSpinner = false;
    this.pedidosSvc.leerPedidosPendientesBDLocal(this.sucursal.clave).subscribe({
      next: (response: any) => {
        console.log('pedidos pendientes BD local =====>', response);
        if (response.length > 0) {
          let pedidosLocal: Pedido[] = [];
          for (let pS of response) {
            let pL = new Pedido(pS.idPedido,pS.numeroPedido,pS.idCliente,pS.datosCliente,
            pS.idDomicilioCliente, pS.datosDomicilioCliente, pS.claveSucursal,
            pS.datosSucursal, pS.fechaHora, pS.estatus, pS.modalidadEntrega,
            pS.montoTotal, pS.detallePedido, pS.instruccionesEspeciales, /*pS.promocionesAplicadas,*/
            pS.tipoPago, pS.cantidadProductos, pS.resumenPedido, pS.urlReciboPago
            /*pS.montoSubtotal, pS.montoDescuento*/);
            pedidosLocal.push(pL);
          }
          this.categorizarPedidos(pedidosLocal);
        }
        this.showSpinner = false;
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos pendientes BD local.');
        console.log(error);
      }
    });
  }

  leerPedidosNubeServidor() {
    this.pedidosSvc.leerPedidosNubeServidor(this.sucursal.clave).subscribe({
      next: (response: any) => {
        const pedidosAWS = response;
        console.log('pedidos de AWS->', pedidosAWS);
        let pedidosLocal: Pedido[] = [];
        for (let pS of pedidosAWS) {
          let pL = new Pedido(pS.idPedido,pS.numeroPedido,pS.idCliente,pS.datosCliente,
            pS.idDomicilioCliente, pS.datosDomicilioCliente, pS.claveSucursal,
            pS.datosSucursal, pS.fechaHora, pS.estatus, pS.modalidadEntrega,
            pS.montoTotal, pS.detallePedido, pS.instruccionesEspeciales, /*pS.promocionesAplicadas,*/
            pS.tipoPago, pS.cantidadProductos, pS.resumenPedido, pS.urlReciboPago
            /*pS.montoSubtotal, pS.montoDescuento*/);
          pedidosLocal.push(pL);
        }
        //for (let p of pedidosAWS) {
        for (let p of pedidosLocal) {
          let pedido: Pedido = p;
          pedido.estatus = environment.estatusRecibePedido;
          pedido.fechaRecibido = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
          this.insertaPedidoBDLocal(pedido);
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al leer los pedidos que están en el servidor AWS.');
        console.log(error);
      }
    });
  }

  insertaPedidoBDLocal(pedido: Pedido) {
    this.pedidosSvc.insertarPedidoBDLocal(pedido).subscribe({
      next: (response: any) => {
        console.log('pedido insertado en la BD local.');
        this.actualizaPedidoBDServidor(pedido);
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al insertar el pedido en la BD local.');
        console.log(error);
      }
    });
  }

  actualizaPedidoBDServidor(pedido: Pedido) {
    this.pedidosSvc.actualizarEstatusPedidoNubeServidor(pedido).subscribe({
      next: (response: any) => {
        console.log('pedido actualizado en el servidor AWS.');
        this.pedidosRP.push(pedido);
        this.pedidosRP.sort((a, b) => a.numeroPedido - b.numeroPedido);
        this.cdr.detectChanges();
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al actualizar el pedido en el servidor AWS.');
        console.log(error);
      }
    });
  }

  categorizarPedidos(pedidos: Pedido[]) {
    this.pedidosRP = pedidos.filter((p) => p.estatus === environment.estatusRecibePedido);
    this.pedidosCP = pedidos.filter((p) => p.estatus === environment.estatusCapturaPedido);
    this.pedidosEP = pedidos.filter((p) => p.estatus === environment.estatusEnviaPedido);
    this.pedidosLP = pedidos.filter((p) => p.estatus === environment.estatusListoPedido);
    this.pedidoGroups = [
      {
        title: 'Pedidos recibidos',
        subtitle: 'Estatus en móvil: Pedido recibido en sucursal',
        pedidos: this.pedidosRP,
        value: 'pr',
      },
      {
        title: 'Pedidos capturados (en preparación)',
        subtitle: 'Estatus en móvil: Pedido en preparación',
        pedidos: this.pedidosCP,
        value: 'pc',
      },
      {
        title: 'Pedidos enviados (entrega en domicilio)',
        subtitle: 'Estatus en móvil: Pedido en proceso de entrega',
        pedidos: this.pedidosEP,
        value: 'pe',
      },
      {
        title: 'Pedidos listos (para pasar por ellos)',
        subtitle: 'Estatus en móvil: Pedido listo para pasar por el',
        pedidos: this.pedidosLP,
        value: 'pl',
      },
    ];
    this.cdr.detectChanges();
  }

  verPedido(pedido: Pedido) {
    this.router.navigateByUrl(environment.paginaPedidoDetalle, { state: { data: pedido } });
  }

}

