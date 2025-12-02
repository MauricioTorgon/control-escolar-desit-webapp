import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { FacadeService } from 'src/app/services/facade.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EditarUserModalComponent } from 'src/app/modals/editar-user-modal/editar-user-modal.component';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {
  // Variables y métodos del componente
  public name_user: string = "";
  public lista_admins: any[] = [];
  public rol: string = "";
  public token: string = "";

  constructor(
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // Lógica de inicialización aquí
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    // Obtenemos los administradores
    this.obtenerAdmins();
  }

  //Obtener lista de usuarios
  public obtenerAdmins() {
    this.administradoresService.obtenerListaAdmins().subscribe(
      (response) => {
        this.lista_admins = response;
        console.log("Lista users: ", this.lista_admins);
      }, (error) => {
        alert("No se pudo obtener la lista de administradores");
      }
    );
  }

  public goEditar(idUser: number) {
    // Se obtiene el ID del usuario en sesión, es decir, quien intenta eliminar
    const userIdSession = Number(this.facadeService.getUserId());
    // --------- Pero el parametro idUser (el de la función) es el ID del admin que se quiere eliminar ---------
    if (this.rol === 'administrador') {
      //Si es administrador puede eliminar a otro administrador
      const dialogRef = this.dialog.open(EditarUserModalComponent, {
        data: { id: idUser, rol: 'administrador' }, //Se pasan valores a través del componente
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.isDelete) {
          console.log("Se va a editar el Administrador");
          this.router.navigate(["registro-usuarios/administrador/" + idUser]);
        } else {
          console.log("No se editó el Administrador");
        }
      });
    } else {
      alert("No tienes permisos para eliminar este Alumno.");
    }
    
  }

  public delete(idUser: number) {
    // Se obtiene el ID del usuario en sesión, es decir, quien intenta eliminar
    const userIdSession = Number(this.facadeService.getUserId());
    // --------- Pero el parametro idUser (el de la función) es el ID del admin que se quiere eliminar ---------
    if (this.rol === 'administrador') {
      //Si es administrador puede eliminar a otro administrador
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idUser, rol: 'administrador' }, //Se pasan valores a través del componente
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.isDelete) {
          console.log("Administrador eliminado");
          alert("Administrador eliminado correctamente.");
          //Recargar página
          window.location.reload();
        } else {
          alert("Administrador no se ha podido eliminar.");
          console.log("No se eliminó el Administrador");
        }
      });
    } else {
      alert("No tienes permisos para eliminar este Alumno.");
    }
  }

}
