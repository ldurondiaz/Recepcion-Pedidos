import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ConfiguracionService } from '../../services/configuracion.service';
//import { SharedModule } from '../../shared/shared.module'
import { SucursalNube } from '../../model/sucursalNube';
import { Sucursal } from '../../model/sucursal';
import { Mensajes } from '../../utils/mensajes';
import { RelojComponent } from '../../components/reloj/reloj.component';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RelojComponent/*, SharedModule*/]
})
export class ConfiguracionPage implements OnInit {

  sucursalForma!: FormGroup;
  public sucursales!: SucursalNube[];
  private sucursal: Sucursal = new Sucursal;
  public selectedValue!: string;

  constructor(private fb: FormBuilder, private configuracionSvc: ConfiguracionService,
    private alertController: AlertController, private router: Router
  ) {
    this.sucursalForma = this.fb.group({
      sucursal: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.configuracionSvc.leeConfiguracionListaSucursales().subscribe({
      next: (response: any) => {
        this.sucursales = response;
        if (this.sucursales) {
          console.log('sucursales--->', this.sucursales);
        }
        else {
          console.log('Incorrecto, no se cargaron los datos de sucursales');
        }
      },
      error: (error: any) => {
        console.log('Ocurrió un error al cargar los datos de sucursales:');
        console.log(error);
      }
    });
  }

  onSelectChange(event: any) {
    this.selectedValue = event.detail.value;
    const selectedSucursal = this.sucursales.find(sucursal => sucursal.clave === this.selectedValue);
    const selectedText = selectedSucursal ? selectedSucursal.nombreSucursal : '';
    this.sucursal.clave = this.selectedValue;
    this.sucursal.nombre = selectedText;
  }

  onSubmit() {
    if (this.sucursalForma.valid) {
      console.log('formulario válido');
      this.configuracionSvc.insertaConfiguracionSucursal(this.sucursal).subscribe({
        next: (response: any) => {
          console.log(response);
          Mensajes.datosCorrectos(this.alertController, 'Datos registrados', 'Se han registrado los datos de la sucursal',
            this.sucursalForma, this.router, environment.paginaMenu);
        },
        error: (error: any) => {
          console.log('Ocurrió un error al insertar datos sucursal');
          console.log(error);
        }
      });
    } else {
      Mensajes.datosError(this.alertController, 'Datos incompletos',
        'Debe de seleccionar una sucursal', this.sucursalForma);
    }
  }

}
