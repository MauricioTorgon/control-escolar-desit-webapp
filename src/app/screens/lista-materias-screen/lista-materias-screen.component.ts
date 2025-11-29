import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-lista-materias-screen',
  templateUrl: './lista-materias-screen.component.html',
  styleUrls: ['./lista-materias-screen.component.scss']
})
export class ListaMateriasScreenComponent implements OnInit {
  
  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];

  // Columnas base
  displayedColumns: string[] = ['nrc', 'nombre', 'seccion', 'dias', 'horario', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<any>(this.lista_materias);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public facadeService: FacadeService,
    private materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();

    // Regla de negocio: Maestro no puede ver editar ni eliminar
    if (this.rol !== 'administrador') {
      // Filtramos las columnas protegidas
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'editar' && col !== 'eliminar');
    }

    this.obtenerMaterias();
  }

  // Obtener lista
  obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;
        this.dataSource.data = this.lista_materias;

        // Timeout para que cargue el paginator y sort después de obtener los datos
          setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            if (this.sort) {
            this.dataSource.sort = this.sort;
          }
          });
      },
      (error) => {
        console.error("Error al obtener materias:", error);
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  // Filtro de búsqueda
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goEditar(idMateria: number) {
    if (this.rol === 'administrador') {
      this.router.navigate(['/registro-materias/', idMateria]);
    } else {
      alert("No tienes permisos para editar.");
    }
  }

  delete(idMateria: number) {

    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: { id: idMateria, rol: 'materia' }, // Pasamos datos visuales
      height: '288px',
      width: '328px',
    });

    // Esperamos a que se cierre
    dialogRef.afterClosed().subscribe(result => {
      // Si el resultado es "isDelete: true", entonces procedemos a llamar al servicio
      if (result.isDelete) {
          console.log("Materia eliminada");
          alert("Materia eliminada correctamente.");
          //Recargar página
          window.location.reload();
        } else {
          alert("La materia no se ha podido eliminar.");
          console.log("No se eliminó la Materia");
        }
    });
  }
}
