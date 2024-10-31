import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, pencilOutline, trashOutline, pin, arrowForwardCircle, business } from 'ionicons/icons';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class EmpleadosPage implements OnInit {

  constructor() {
    addIcons({ addOutline, pencilOutline, trashOutline, pin, arrowForwardCircle, business });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
  }

  agregar() {
    console.log('Agregar');
  }

  editar() {
    console.log('Editar');
  }

  eliminar() {
    console.log('Eliminar');
  }

}
