import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'; 
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-maestros-screen',
  templateUrl: './maestros-screen.component.html',
  styleUrls: ['./maestros-screen.component.scss']
})

export class MaestrosScreenComponent implements OnInit, AfterViewInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_maestros: any[] = [];

  displayedColumns: string[] = ['id_trabajador', 'nombre', 'email', 'fecha_nacimiento', 'telefono', 'rfc', 'cubiculo', 'area_investigacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosUsuario>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public facadeService: FacadeService,
    public maestrosService: MaestrosService,
    private router: Router,
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
    this.dataSource.filterPredicate = (data: DatosUsuario, filter: string) => {
      const nombreCompleto = data.nombre ||'';
      return nombreCompleto.includes(filter);
    };

    this.obtenerMaestros();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        let maestrosData: DatosUsuario[] = response as DatosUsuario[];
        
        if (maestrosData.length > 0) {
          maestrosData.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
            usuario.nombre = usuario.user.first_name.toLowerCase() + ' ' + usuario.user.last_name.toLowerCase();
          });
        }
        console.log("Maestros: ", this.lista_maestros);
        
        this.dataSource.data = maestrosData;
        
      }, (error) => {
        console.error("Error al obtener la lista de maestros: ", error);
        alert("No se pudo obtener la lista de maestros");
        this.lista_maestros = [];
        this.dataSource.data = [];
      }
    );
  }


  public goEditar(idUser: number) {
    this.router.navigate(["registro-usuarios/maestros/" + idUser]);
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

export interface DatosUsuario {
  id: number,
  id_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string,
  telefono: string,
  rfc: string,
  cubiculo: string,
  area_investigacion: number,
  
  nombre?: string;
  user?: any;
}