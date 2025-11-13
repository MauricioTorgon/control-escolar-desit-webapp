import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];

  displayedColumns: string[] = ['matricula', 'nombre', 'email', 'fecha_nacimiento', 'edad', 'telefono', 'curp', 'rfc', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosAlumno>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public facadeService: FacadeService,
    private router: Router,
    private alumnosService: AlumnosService
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    
    //filtro para busqueda
    this.dataSource.filterPredicate = (data: DatosAlumno, filter: string) => {
      const nombreCompleto = data.nombre || ''; 
      return nombreCompleto.includes(filter);
    };

    this.obtenerAlumnos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        let alumnosData: DatosAlumno[] = response as DatosAlumno[];
        
        if (alumnosData.length > 0) {
          alumnosData.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
            
            usuario.nombre = usuario.user.first_name.toLowerCase() + ' ' + usuario.user.last_name.toLowerCase();
          });
        }
        
        this.dataSource.data = alumnosData;
        
      }, (error) => {
        console.error("Error al obtener la lista de alumnos: ", error);
        alert("No se pudo obtener la lista de alumnos");
        this.lista_alumnos = [];
        this.dataSource.data = [];
      }
    );
  }

  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/alumnos/" + idUser]);
  }

  public delete(idUser: number) {

  }

    public Filtrar(target: any) {
    const filterValue = target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

export interface DatosAlumno {
  id: number;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  curp: string;
  rfc: string;
  edad: number;
  telefono: string;
  ocupacion: string;
  
  nombre?: string;
  user?: any;
}