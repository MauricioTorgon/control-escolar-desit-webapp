import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'; // Importación necesaria
@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {
  editarPadre: boolean = false;
  constructor( private location:Location) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  recibirDato(valor: any) {
    this.editarPadre = valor;
  }
  public goBack() {
      this.location.back();
  }
}