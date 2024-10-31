import { Injectable } from '@angular/core';
import { Sucursal } from './sucursal';

@Injectable()
export class Administrador {
  private static instance: Administrador;

  private titulo!: string;
  private sucursal!: Sucursal;

  private constructor() {
  }

  public static getInstance(): Administrador {
      if (!Administrador.instance) {
          Administrador.instance = new Administrador();
      }
      return Administrador.instance;
  }

  getTitulo(): string {
    return this.titulo;
  }

  setTitulo(titulo: string): void {
    this.titulo = titulo;
  }

  public getSucursal(): Sucursal {
    return this.sucursal;
  }

  public setSucursal(sucursal: Sucursal) {
    this.sucursal = sucursal;
  }

}
