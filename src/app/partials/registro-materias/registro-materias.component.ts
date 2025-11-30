import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; // Importación necesaria
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { ValidatorService } from 'src/app/services/tools/validator.service';

@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit {
  errors: any = {};
  public editar: boolean = false;
  private idMateria: any = "";
  public lista_maestros: any[] = [];

  // Inicialización del modelo
  materia: any = {};
  dias: any = {};

  // Opciones de programa
  programas = [
    { value: 'Ingeniería en Ciencias de la Computación', viewValue: 'Ingeniería en Ciencias de la Computación' },
    { value: 'Licenciatura en Ciencias de la Computación', viewValue: 'Licenciatura en Ciencias de la Computación' },
    { value: 'Ingeniería en Tecnologías de la Información', viewValue: 'Ingeniería en Tecnologías de la Información' }
  ];

  constructor(
    private location: Location,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService,
    private validatorService: ValidatorService
  ) { }

  ngOnInit(): void {
    // Inicializar modelos desde el servicio para asegurar estructura
    this.materia = this.materiasService.esquemaMateria();
    this.dias = { Lunes: false, Martes: false, Miercoles: false, Jueves: false, Viernes: false, Sabado: false };

    this.obtenerMaestros();

    const id = this.activeRoute.snapshot.params['id'];
    if (id) {
      this.editar = true;
      this.idMateria = id;
      this.cargarMateria();
    }
  }

  obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        // Formatear nombre para mostrarlo bonito en el select
        this.lista_maestros.forEach(maestro => {
          maestro.nombreCompleto = maestro.user.first_name + " " + maestro.user.last_name;
        });
      },
      (error) => { alert("Error al obtener maestros"); }
    );
  }

  actualizarDiasSeleccionados() {
    const diasSeleccionados = Object.keys(this.dias).filter(dia => this.dias[dia as keyof typeof this.dias]);
    //this.materia.dias = diasSeleccionados;
    const datosParaEnvio = {
      nrc: this.materia.nrc,
      nombre: this.materia.nombre,
      seccion: this.materia.seccion,
      dias: diasSeleccionados,
      hora_inicio: this.materia.horaInicio,
      hora_fin: this.materia.horaFin,
      salon: this.materia.salon,
      programa: this.materia.programa,
      profesor: this.materia.profesor,
      creditos: this.materia.creditos
    };
    return datosParaEnvio;
  }

  registrar() {
    this.errors = {};
    //const diasSeleccionados = Object.keys(this.dias).filter(dia => this.dias[dia as keyof typeof this.dias]);

    // Asignar el ID del profesor seleccionado directamente al modelo si es necesario
    // (Angular Material lo hace automático con ngModel, pero verificamos)

    const datosParaEnvio = this.actualizarDiasSeleccionados();

    this.errors = this.materiasService.validarMateria(datosParaEnvio);
    if (Object.keys(this.errors).length > 0) return;

    this.materiasService.registrarMateria(datosParaEnvio).subscribe(
      (response) => {
        alert("Materia registrada correctamente");
        this.router.navigate(['/home']);
      },
      (error) => { alert("Error al registrar: " + error.error.message); }
    );
  }

  actualizar() {
    // Lógica similar a registrar pero con actualizarMateria
    //const diasSeleccionados = Object.keys(this.dias).filter(dia => this.dias[dia as keyof typeof this.dias]);

    const datosParaEnvio = this.actualizarDiasSeleccionados();

    this.errors = this.materiasService.validarMateria(datosParaEnvio);
    if (Object.keys(this.errors).length > 0) return;

    this.materiasService.actualizarMateria(datosParaEnvio).subscribe(
      (response) => {
        alert("Materia actualizada");
        this.router.navigate(['/home']);
      },
      (error) => { alert("Error al actualizar"); }
    );
  }

  cargarMateria() {
    this.materiasService.getMateriaByID(this.idMateria).subscribe(
      (response) => {
        this.materia = response;
        // Mapear campos de snake_case (Django) a camelCase si tu servicio no lo hace
        // Asumiendo que el servicio ya lo devuelve limpio o usas el mismo nombre:
        if (response.dias) {
          response.dias.forEach((dia: any) => { (this.dias as any)[dia] = true; });
        }
        this.materia.horaInicio = response.hora_inicio ? response.hora_inicio.slice(0, 5) : '';
        this.materia.horaFin = response.hora_fin ? response.hora_fin.slice(0, 5) : '';
      },
      (error) => {
        alert("No se pudo obtener la materia");
      }
    );
  }

  regresar() {
    this.location.back();
  }

  // --- FUNCIONES DE VALIDACIÓN (MÁSCARAS Y EVENTOS) ---
  // Imitando estilo de registro-maestros.component.ts

  public soloLetras(event: KeyboardEvent) {
    // Validar la tecla presionada
    if (this.validatorService.words(event.key)) {
      return true;
    }
    return false;
  }


  public soloNumeros(event: KeyboardEvent) {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Solo números del 0-9
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  public soloAlfanumerico(event: KeyboardEvent) {
    if (this.validatorService.alfanumeric(event.key)) {
      return true;
    }
    return false;
  }
}