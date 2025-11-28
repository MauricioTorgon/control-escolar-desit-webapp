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

  // Ir a editar (Solo Admin podrá ver el botón, pero protegemos la función por si acaso)
  goEditar(idMateria: number) {
    if (this.rol === 'administrador') {
      this.router.navigate(['/registro-materias/editar', idMateria]); // Ajusta la ruta si planeas usar el mismo form
    } else {
      alert("No tienes permisos para editar.");
    }
  }

  // Eliminar materia
  delete(idMateria: number) {
    if (this.rol === 'administrador') {
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idMateria, rol: 'materia' }, // Pasamos 'materia' para que el modal sepa qué texto mostrar (si está configurado genérico)
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          // Llamar al servicio de eliminación
          this.materiasService.eliminarMateria(idMateria).subscribe(
            (response) => {
              alert("Materia eliminada correctamente");
              this.obtenerMaterias(); // Recargar tabla
            },
            (error) => {
              alert("Error al eliminar la materia");
              console.error(error);
            }
          );
        }
      });
    } else {
      alert("No tienes permisos para eliminar.");
    }
  }
}
