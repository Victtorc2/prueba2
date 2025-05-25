import { AfterViewInit, Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-admin-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  ventas = [
    { id: '#1001', fecha: '19/5/2025', vendedor: 'Juan Pérez', productos: 2, total: 350 },
    { id: '#1002', fecha: '19/5/2025', vendedor: 'Juan Pérez', productos: 5, total: 820 },
    { id: '#1003', fecha: '18/5/2025', vendedor: 'Ana López', productos: 3, total: 410 },
    { id: '#1004', fecha: '18/5/2025', vendedor: 'Carlos Ruiz', productos: 4, total: 600 },
    { id: '#1005', fecha: '17/5/2025', vendedor: 'Laura García', productos: 6, total: 920 },
  ];


}
