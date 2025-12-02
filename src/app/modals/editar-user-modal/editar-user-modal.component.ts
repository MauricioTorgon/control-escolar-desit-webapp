import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-editar-user-modal',
  templateUrl: './editar-user-modal.component.html',
  styleUrls: ['./editar-user-modal.component.scss']
})
export class EditarUserModalComponent {
  public rol: string = "";

  constructor(
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    private dialogRef: MatDialogRef<EditarUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.rol = this.data.rol;
  }
  public isMateria() {
    return this.rol === "materia";
  }
  public cerrar_modal() {
    this.dialogRef.close({ isDelete: false });
  }

  public editarUser() {
    this.dialogRef.close({ isDelete: true });
  }

}
