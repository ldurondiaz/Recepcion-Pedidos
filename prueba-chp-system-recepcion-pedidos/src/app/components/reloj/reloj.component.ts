import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reloj',
  templateUrl: './reloj.component.html',
  styleUrls: ['./reloj.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class RelojComponent implements OnInit, OnDestroy {
  fechaHoraActual: string = '';
  private intervalo: any;

  ngOnInit() {
    this.actualizarHora();
    this.intervalo = setInterval(() => this.actualizarHora(), 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalo); // Detenemos el intervalo al destruir el componente
  }

  private actualizarHora() {
    const ahora = new Date();
    const opcionesFecha = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } as const;
    const fecha = ahora.toLocaleDateString('es-ES', opcionesFecha);
    //const hora = ahora.toLocaleTimeString('es-ES', { hour12: false });
    const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    this.fechaHoraActual = `${fecha.charAt(0).toUpperCase() + fecha.slice(1)} ${hora}`;
  }
}
