import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  ventas = [
    { id: '#1001', fecha: '19/5/2025', vendedor: 'Juan Pérez', productos: 2, total: 350 },
    { id: '#1002', fecha: '19/5/2025', vendedor: 'Juan Pérez', productos: 5, total: 820 },
    { id: '#1003', fecha: '19/5/2025', vendedor: 'Juan Pérez', productos: 5, total: 820 },
    { id: '#1004', fecha: '19/5/2025', vendedor: 'Juan Pérez', productos: 3, total: 410 },
    { id: '#1005', fecha: '19/5/2025', vendedor: 'Juan Pérez', productos: 2, total: 220 },
    { id: '#1006', fecha: '19/5/2025', vendedor: 'Juan Pérez', productos: 4, total: 760 },
  ];
}
