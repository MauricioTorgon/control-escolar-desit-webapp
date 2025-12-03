import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  @Output() editarHijo: EventEmitter<any> = new EventEmitter<any>();

  materia: any = {};
  dias: any = {};

  programas = [
    { value: 'Ingeniería en Ciencias de la Computación', viewValue: 'Ingeniería en Ciencias de la Computación' },
    { value: 'Licenciatura en Ciencias de la Computación', viewValue: 'Licenciatura en Ciencias de la Computación' },
    { value: 'Ingeniería en Tecnologías de la Información', viewValue: 'Ingeniería en Tecnologías de la Información' }
  ];

  public lista_dias: any[] = [
    {value: 'Lunes', viewValue: 'Lunes'},
    {value: 'Martes', viewValue: 'Martes'},
    {value: 'Miercoles', viewValue: 'Miércoles'},
    {value: 'Jueves', viewValue: 'Jueves'},
    {value: 'Viernes',viewValue: 'Viernes'},
  ];

  constructor(
    private location: Location,
    private router: Router,
    private activated: ActivatedRoute,
    private materiasService: MateriasService,
    private maestrosService: MaestrosService,
    private validatorService: ValidatorService
  ) { }

  ngOnInit(): void {
    this.materia = this.materiasService.esquemaMateria();
    this.materia.dias = [];

    this.obtenerMaestros();

    if (this.activated.snapshot.params['id'] != undefined) {
      const id = this.activated.snapshot.params['id'];
      this.editar = true;
      this.editarHijo.emit(this.editar);
      this.idMateria = id;
      this.cargarMateria();
    }
  }

  obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        this.lista_maestros.forEach(maestro => {
          maestro.nombreCompleto = maestro.user.first_name + " " + maestro.user.last_name;
        });
      },
      (error) => { alert("Error al obtener maestros"); }
    );
  }


  registrar() {
    this.errors = {};
    this.errors = this.materiasService.validarMateria(this.materia);
    if (Object.keys(this.errors).length > 0) return;

    this.materiasService.registrarMateria(this.materia).subscribe(
      (response) => {
        alert("Materia registrada correctamente");
        this.router.navigate(['/home']);
      },
      (error) => { alert("Error al registrar: " + error.error.message); }
    );
  }

  actualizar() {
    this.materia.id = this.idMateria;
    this.errors = this.materiasService.validarMateria(this.materia);
    if (Object.keys(this.errors).length > 0) return;

    this.materiasService.actualizarMateria(this.materia).subscribe(
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
        if (!this.materia.dias) {
          this.materia.dias = [];
        }
        if(this.materia.hora_inicio){
            this.materia.hora_inicio = this.materia.hora_inicio.slice(0, 5);
        }
        if(this.materia.hora_fin){
            this.materia.hora_fin = this.materia.hora_fin.slice(0, 5);
        }
      },
      (error) => {
        alert("No se pudo obtener la materia");
      }
    );
  }

  public goBack() {
    this.location.back();
  }

  public checkboxChange(event: any) {
    console.log("Evento: ", event);
    if (event.checked) {
      // Si se marca, agregamos el valor al array
      this.materia.dias.push(event.source.value);
    } else {
      // Si se desmarca, buscamos y eliminamos del array
      console.log(event.source.value);
      this.materia.dias.forEach((dia: any, i: any) => {
        if (dia == event.source.value) {
          this.materia.dias.splice(i, 1);
        }
      });
    }
    console.log("Array dias: ", this.materia.dias);
  }

  public revisarSeleccion(nombre: string) {
    if (this.materia.dias) {
      var busqueda = this.materia.dias.find((element: any) => element == nombre);
      if (busqueda != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  public soloNumeros(event: KeyboardEvent) {
    // Solo números del 0-9
    if (this.validatorService.numeric(event.key) == false) {
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