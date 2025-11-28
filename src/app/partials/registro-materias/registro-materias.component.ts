import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';

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
    private materiasService: MateriasService
  ) { }

  ngOnInit(): void {
  }

registrar() {
    // Limpiar errores previos
    this.errors = {}; 
    // Validación
  // Convertir días booleanos a array para validar y enviar
  const diasSeleccionados = Object.keys(this.dias).filter(dia => this.dias[dia as keyof typeof this.dias]);
  
  // Preparar objeto para validación y envío (Mapping camelCase -> snake_case)
  const datosParaEnvio = {
    nrc: this.materia.nrc,
    nombre: this.materia.nombre,
    seccion: this.materia.seccion,
    dias: diasSeleccionados,
    hora_inicio: this.materia.horaInicio, // Mapping importante para Django
    hora_fin: this.materia.horaFin        // Mapping importante para Django
  };

  // Usar validador del servicio si lo deseas, o tu validación local.
  // Si usas tu validación local, solo asegúrate de checkear diasSeleccionados.length
  
  if (diasSeleccionados.length == 0) {
    alert("Selecciona al menos un día");
    return;
  }

  // Enviar al servicio
  this.materiasService.registrarMateria(datosParaEnvio).subscribe(
    (response) => {
      alert("Materia registrada correctamente");
      console.log("Respuesta servidor:", response);
      this.router.navigate(['/home']); // O a '/materias' cuando exista la lista
    },
    (error) => {
      console.error("Error al registrar:", error);
      alert("Error al registrar la materia: " + (error.error.message || "Error desconocido"));
    }
  );
   
  }
  
  actualizar() {
    // Lógica futura para edición
    console.log("Actualizando...");
  }

  regresar() {
    this.router.navigate(['/home']);
  }
}