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
  IonAccordionGroup, IonAccordion, IonIcon, IonButton} from '@ionic/angular/standalone';
import { RelojComponent } from '../../components/reloj/reloj.component';
import { ChangeDetectorRef } from '@angular/core';
import { Strings } from 'src/app/utils/strings';
import { addIcons } from 'ionicons';
import { timerOutline, chevronUpOutline, chevronDownOutline, arrowRedo } from 'ionicons/icons';
import { AlertController } from '@ionic/angular';
import { Empleado } from 'src/app/model/empleado';
import { EncriptarDesencriptar } from 'src/app/utils/encriptarDesencriptar';
import { EmpleadosService } from 'src/app/services/empleados.service';

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
    IonIcon,
    IonButton,
    RelojComponent
  ],
})
export class PedidosPage implements OnInit, OnDestroy {
  intervalId5seg: any;
  intervalId60seg: any;
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
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private empleadosSvc: EmpleadosService,
  ) {
    this.administrador = Administrador.getInstance();
    addIcons({ timerOutline, chevronUpOutline, chevronDownOutline, arrowRedo });
  }

  ngOnInit() {
    console.log('ESTOY EN PEDIDOS ngOnInit');
    this.sucursal = this.administrador.getSucursal();
    this.leerPedidosPendientesBDLocalPedido();
    this.intervalId5seg = setInterval(() => {
      this.leerPedidosNubeServidor();
    }, 5000);
    this.intervalId60seg = setInterval(() => {
      this.actualizarTiempoEspera();
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId5seg) {
      clearInterval(this.intervalId5seg);
    }
    if (this.intervalId60seg) {
      clearInterval(this.intervalId60seg);
    }
  }

  toggleDetalles(area: string, pedido: Pedido, event: Event) {
    event.stopPropagation(); // Evita que el clic en el título afecte el card completo
    switch(area) {
      case 'cliente': pedido.mostrarDetallesCliente = !pedido.mostrarDetallesCliente; break;
      case 'pedido' : pedido.mostrarDetallesPedido = !pedido.mostrarDetallesPedido; break;
    }
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
            pS.datosSucursal, pS.fechaHora, pS.tiempoEspera, pS.estatus, pS.modalidadEntrega,
            pS.montoTotal, pS.detallePedido, pS.instruccionesEspeciales, /*pS.promocionesAplicadas,*/
            pS.tipoPago, pS.cantidadProductos, pS.resumenPedido, pS.urlReciboPago
            /*pS.montoSubtotal, pS.montoDescuento*/);
          pedidosLocal.push(pL);
        }
        for (let p of pedidosLocal) {
          let pedido: Pedido = p;
          pedido.estatus = environment.estatusRecibePedido;
          pedido.fechaRecibido = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
          this.insertaPedidoBDLocalPedido(pedido);
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al leer los pedidos que están en el servidor AWS.');
        console.log(error);
      }
    });
  }

  actualizaPedidoBDNubeServidor(pedido: Pedido) {
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

  leerPedidosPendientesBDLocalPedido() {
    this.showSpinner = false;
    this.pedidosSvc.leerPedidosPendientesBDLocalPedido(this.sucursal.clave).subscribe({
      next: (response: any) => {
        console.log('pedidos pendientes BD local =====>', response);
        if (response.length > 0) {
          let pedidosLocal: Pedido[] = [];
          for (let pS of response) {
            let pL = new Pedido(pS.idPedido,pS.numeroPedido,pS.idCliente,pS.datosCliente,
            pS.idDomicilioCliente, pS.datosDomicilioCliente, pS.claveSucursal,
            pS.datosSucursal, pS.fechaHora, pS.tiempoEspera, pS.estatus, pS.modalidadEntrega,
            pS.montoTotal, pS.detallePedido, pS.instruccionesEspeciales, /*pS.promocionesAplicadas,*/
            pS.tipoPago, pS.cantidadProductos, pS.resumenPedido, pS.urlReciboPago
            /*pS.montoSubtotal, pS.montoDescuento*/);
            pedidosLocal.push(pL);
          }
          this.categorizarPedidos(pedidosLocal);
          this.actualizarTiempoEspera();
        }
        this.showSpinner = false;
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de los pedidos pendientes BD local.');
        console.log(error);
      }
    });
  }

  insertaPedidoBDLocalPedido(pedido: Pedido) {
    this.pedidosSvc.insertarPedidoBDLocalPedido(pedido).subscribe({
      next: (response: any) => {
        console.log('pedido insertado en la BD local.');
        this.actualizaPedidoBDNubeServidor(pedido);
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al insertar el pedido en la BD local.');
        console.log(error);
      }
    });
  }

  actualizaPedidoBDLocalPedido(pedido: Pedido) {
    this.pedidosSvc.actualizarEstatusPedidoBDLocalPedido(pedido).subscribe({
      next: (response: any) => {
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al actualizar los datos del pedido:');
        console.log(error);
      }
    });
  }

  insertaPedidoBDLocalHistorial(pedido: Pedido) {
    console.log('PPPEEEDDDIIIDDDOOO->', pedido);
    this.pedidosSvc.insertarPedidoBDLocalHistorial(pedido).subscribe({
      next: (response: any) => {
        console.log('pedido insertado en la BD local.');
        //this.eliminaPedidoBDLocalPedido(pedido);
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al insertar el pedido en la BD local.');
        console.log(error);
      }
    });
  }

  eliminaPedidoBDLocalPedido(pedido: Pedido) {
    this.pedidosSvc.eliminaPedidoBDLocal(pedido).subscribe({
      next: (response: any) => {
        console.log('pedido eliminado de la BD local.');
        console.log(response);
      },
      error: (error: any) => {
        console.log('Ocurrió un error al eliminar el pedido en la BD local.');
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

  actualizarTiempoEspera() {
    const fechaActual = new Date();
    [...this.pedidosRP, ...this.pedidosCP, ...this.pedidosEP, ...this.pedidosLP].forEach((pedido) => {
      //const fechaPedido = new Date(pedido.fechaHora);
      const fechaHoraPedido = new Date(Strings.dateformatAAAAMMDDHHMMSSsssToAAAA_MM_DDTHH_MM_SS(pedido.fechaHora));
      console.log('fechaHoraPedido:', fechaHoraPedido);
      console.log('fechaActual:', fechaActual);
      const diferenciaMs = Math.abs(fechaHoraPedido.getTime() - fechaActual.getTime());
//    const diferenciaSegundos = Math.floor((diferenciaMs / 1000) % 60);
      const diferenciaMinutos = Math.floor((diferenciaMs / (1000 * 60)) % 60);
      const minutosFormato = diferenciaMinutos.toString().padStart(2, '0');
      const diferenciaHoras = Math.floor((diferenciaMs / (1000 * 60 * 60)) % 24);
      const horasFormato = diferenciaHoras.toString().padStart(2, '0');
      const diferenciaDias = Math.floor((diferenciaMs / (1000 * 60 * 60 * 24)) % 30.4375); // Aproximado
      const diasFormato = diferenciaDias > 0 ? diferenciaDias.toString() + ' días, ':'';
//    const diferenciaMeses = Math.floor((diferenciaMs / (1000 * 60 * 60 * 24 * 30.4375)) % 12);
//    const diferenciaAnios = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24 * 365.25));
      pedido.tiempoEspera = diasFormato + horasFormato + ':' + minutosFormato;
      console.log('pedido.tiempoEspera--->>>', pedido.tiempoEspera);
    });
    this.cdr.detectChanges();
  }

/*
  actualizarPedido(pedidoActualizado: Pedido) {
    console.log('*** ESTOY EN ACTUALIZAR PEDIDO ***');
    // 1. Eliminar el pedido de su lista anterior
    this.pedidosRP = this.pedidosRP.filter(p => p.idPedido !== pedidoActualizado.idPedido);
    this.pedidosCP = this.pedidosCP.filter(p => p.idPedido !== pedidoActualizado.idPedido);
    this.pedidosEP = this.pedidosEP.filter(p => p.idPedido !== pedidoActualizado.idPedido);
    this.pedidosLP = this.pedidosLP.filter(p => p.idPedido !== pedidoActualizado.idPedido);
    // 2. Agregarlo a la lista según su nuevo estatus
    console.log('XXX No ha agregado el pedido actualizado');
    console.log('this.pedidosRP:', this.pedidosRP);
    console.log('this.pedidosCP:', this.pedidosCP);
    console.log('this.pedidosEP:', this.pedidosEP);
    console.log('this.pedidosLP:', this.pedidosLP);
    console.log('pedidoActualizado.estatus:', pedidoActualizado.estatus);
    switch (pedidoActualizado.estatus) {
      case environment.estatusRecibePedido:
        this.pedidosRP = [...this.pedidosRP, pedidoActualizado];
        break;
      case environment.estatusCapturaPedido:
        this.pedidosCP = [...this.pedidosCP, pedidoActualizado];
        break;
      case environment.estatusEnviaPedido:
        this.pedidosEP = [...this.pedidosEP, pedidoActualizado];
        break;
      case environment.estatusListoPedido:
        this.pedidosLP = [...this.pedidosLP, pedidoActualizado];
        break;
    }
    this.cdr.detectChanges();
    console.log('*******************************');
    console.log('/// Ya ha agregado el pedido actualizado');
    console.log('this.pedidosRP:', this.pedidosRP);
    console.log('this.pedidosCP:', this.pedidosCP);
    console.log('this.pedidosEP:', this.pedidosEP);
    console.log('this.pedidosLP:', this.pedidosLP);
  }
*/

  async cambiarEstatus(pedido: Pedido) {
    console.log('Se seleccionó el pedido #', pedido.numeroPedido);
    const alert = await this.alertController.create({
      header: 'Cambiar estatus',
      message: 'Ingresa tu nip para cambiar el estatus al pedido #' + pedido.numeroPedido,
      inputs: [
        {
          name: 'nip',
          placeholder: 'NIP',
          type: 'password',
          attributes: {
            minlength: 3,
            maxlength: 3,
          },
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: async (data) => {
            if (!data.nip || data.nip.trim() === '' || data.nip.length !== 3) {
              this.mensajeErrorNip();
              return false; // Evita que el alert se cierre
            }
            let nip = data.nip;
            let empleado: Empleado = new Empleado;
            empleado.nip = EncriptarDesencriptar.encrypt(nip);
            try {
              const response = await this.empleadosSvc.leerEmpleadoPorNip(empleado).toPromise();
              let emp = response as Empleado;

              if (emp && emp.id) { // Verifica que la propiedad id existe
                pedido.idEmpleadoFechaAtendido = emp.id;
              } else {
                console.log('El empleado no tiene la propiedad id');
                this.mensajeErrorNip();
                return false;
              }
              // Aquí ya tenemos un empleado válido, actualizamos el estatus del pedido
              if (pedido.estatus === environment.estatusRecibePedido) {
                pedido.estatus = environment.estatusCapturaPedido;
                pedido.fechaCapturado = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
                pedido.idEmpleadoFechaCapturado = emp.id;
              } else if (pedido.estatus === environment.estatusCapturaPedido
                && pedido.modalidadEntrega === environment.entregaDomicilio) {
                pedido.estatus = environment.estatusEnviaPedido;
                pedido.fechaEnviado = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
                pedido.idEmpleadoFechaEnviado = emp.id;
              } else if (pedido.estatus === environment.estatusCapturaPedido
                && pedido.modalidadEntrega === environment.entregaSucursal) {
                pedido.estatus = environment.estatusListoPedido;
                pedido.fechaListo = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
                pedido.idEmpleadoFechaListo = emp.id;
              } else if (pedido.estatus === environment.estatusEnviaPedido
                || pedido.estatus === environment.estatusListoPedido) {
                pedido.estatus = environment.estatusAtendidoPedido;
                pedido.fechaAtendido = Strings.fechaHoraActualAAAAMMDDHHMMSSsss();
                pedido.idEmpleadoFechaAtendido = emp.id;
              }
              console.log('EL ESTATUS ES IGUAL A ', pedido.estatus);
              if (pedido.estatus === environment.estatusAtendidoPedido) {
                //TODO quitar pedido de la pedido.pedido e insertar el pedido
                //TODO en la tabla pedido.historial.
                this.insertaPedidoBDLocalHistorial(pedido);
              } else {
                console.log('EL ESTATUS NO ES IGUAL A AP-PEDIDO ATENDIDO');
                this.actualizaPedidoBDLocalPedido(pedido);
              }
              this.actualizaPedidoBDNubeServidor(pedido);
              await new Promise((resolve) => setTimeout(resolve, 300));
              this.leerPedidosPendientesBDLocalPedido();
              this.actualizarTiempoEspera();
              return true; // Permite cerrar el alert
            } catch (error) {
              console.error('Error al cargar datos del empleado:', error);
              this.mensajeErrorNip();
              return false; // Evita cerrar el alert si hay error en la búsqueda del NIP
            }
          },
        },
      ],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

  historial() {
    this.router.navigateByUrl(environment.paginaHistorial);
  }

  async mensajeErrorNip() {
    const alert = await this.alertController.create({
      header: 'Error...',
      message: 'El NIP es incorrecto.',
      buttons: ['OK'],
    });
    alert.backdropDismiss = false;
    await alert.present();
  }

}
