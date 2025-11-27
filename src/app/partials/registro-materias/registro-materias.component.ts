import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {

  errors: any = {};
  public editar:boolean = false;
  // Modelo de datos simple
  materia = {
    nrc: '',
    nombre: '',
    seccion: '',
    horaInicio: '',
    horaFin: ''
  };

  // Checkboxes para días (Modelo separado para facilitar el manejo)
  dias = {
    Lunes: false,
    Martes: false,
    Miercoles: false,
    Jueves: false,
    Viernes: false,
    Sabado: false
  };

  constructor(
    private router: Router,
    private facadeService: FacadeService,
    private validatorsService: FacadeService,
  ) { }

  ngOnInit(): void {
  }

registrar() {
    // Limpiar errores previos
    this.errors = {}; 

    // Validación manual simple (puedes mejorarla con validators.service después)
    if (!this.materia.nrc) { this.errors.nrc = "El NRC es requerido"; }
    if (!this.materia.nombre) { this.errors.nombre = "El nombre es requerido"; }
    if (!this.materia.seccion) { this.errors.seccion = "La sección es requerida"; }
    if (!this.materia.horaInicio) { this.errors.horaInicio = "La hora de inicio es requerida"; }
    if (!this.materia.horaFin) { this.errors.horaFin = "La hora de fin es requerida"; }

    // Validar días
    const diasSeleccionados = Object.keys(this.dias).filter(dia => this.dias[dia as keyof typeof this.dias]);
    if (diasSeleccionados.length === 0) {
      this.errors.dias = "Selecciona al menos un día";
      alert("Selecciona al menos un día"); // Feedback rápido
      return;
    }

    // Si hay errores en el objeto, detener
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // ... lógica de envío
    const datosFinales = { ...this.materia, dias: diasSeleccionados };
    console.log("Datos válidos:", datosFinales);
    alert("Materia registrada con éxito");
    this.router.navigate(['/home']);
  }
  
  actualizar() {
    // Lógica futura para edición
    console.log("Actualizando...");
  }

  regresar() {
    this.router.navigate(['/home']);
  }
}