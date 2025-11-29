import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {

  // Variables para totales (opcional si quieres mostrarlos en texto aparte)
  public total_user: any = {};

  // Colores base para reutilizar
  private colores = ['#F88406', '#FCFF44', '#31E7E7']; 
  private labelsBase = ["Administradores", "Maestros", "Alumnos"];

  // --- CONFIGURACIÓN INICIAL (VACÍA O POR DEFECTO) ---
  // Se llenarán con datos reales al cargar la página

  // 1. Histograma (Line Chart)
  lineChartData = {
    labels: this.labelsBase,
    datasets: [{
      data: [0, 0, 0], // Inicializado en 0
      label: 'Registro de usuarios',
      backgroundColor: '#F88406'
    }]
  };
  lineChartOption = { responsive: false };
  lineChartPlugins = [ DatalabelsPlugin ];

  // 2. Barras (Bar Chart)
  barChartData = {
    labels: this.labelsBase,
    datasets: [{
      data: [0, 0, 0],
      label: 'Usuarios por rol',
      backgroundColor: this.colores
    }]
  };
  barChartOption = { responsive: false };
  barChartPlugins = [ DatalabelsPlugin ];

  // 3. Circular (Pie Chart)
  pieChartData = {
    labels: this.labelsBase,
    datasets: [{
      data: [0, 0, 0],
      label: 'Registro de usuarios',
      backgroundColor: this.colores
    }]
  };
  pieChartOption = { responsive: false };
  pieChartPlugins = [ DatalabelsPlugin ];

  // 4. Dona (Doughnut Chart)
  doughnutChartData = {
    labels: this.labelsBase,
    datasets: [{
      data: [0, 0, 0],
      label: 'Registro de usuarios',
      backgroundColor: this.colores
    }]
  };
  doughnutChartOption = { responsive: false };
  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);

        // Extraer los datos del backend
        const datos = [response.admins, response.maestros, response.alumnos];

        // --- ACTUALIZACIÓN DINÁMICA DE GRÁFICAS ---
        // Es importante recrear el objeto para que Angular detecte el cambio

        // 1. Lineal
        this.lineChartData = {
          labels: this.labelsBase,
          datasets: [{
            data: datos,
            label: 'Usuarios por rol',
            backgroundColor: '#F88406'
          }]
        };

        // 2. Barras
        this.barChartData = {
          labels: this.labelsBase,
          datasets: [{
            data: datos,
            label: 'Usuarios por rol',
            backgroundColor: [
              '#F88406', // Color Admin
              '#FCFF44', // Color Maestro
              '#82D3FB'  // Color Alumno
            ]
          }]
        };

        // 3. Pastel
        this.pieChartData = {
          labels: this.labelsBase,
          datasets: [{
            data: datos,
            label: 'Registro de usuarios',
            backgroundColor: [
              '#FCFF44',
              '#F1C8F2',
              '#31E731'
            ]
          }]
        };

        // 4. Dona
        this.doughnutChartData = {
          labels: this.labelsBase,
          datasets: [{
            data: datos,
            label: 'Registro de usuarios',
            backgroundColor: [
              '#F88406',
              '#FCFF44',
              '#31E7E7'
            ]
          }]
        };

      }, (error) => {
        console.error("Error al obtener total de usuarios ", error);
        // Opcional: Mostrar alerta solo si es crítico
      }
    );
  }
}