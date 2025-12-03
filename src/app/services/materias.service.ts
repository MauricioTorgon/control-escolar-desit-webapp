import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMateria() {
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias': [],
      'hora_inicio': '',
      'hora_fin': '',
      'salon': '',
      'programa': '',
      'profesor': '',
      'creditos': ''
    }
  }

  // Validación para el formulario
  public validarMateria(data: any) {
    console.log("Validando materia... ", data);
    let error: any = [];


    if (!this.validatorService.required(data["nrc"])) {
      error["nrc"] = this.errorService.required;
    } else if (data["nrc"].length < 5 || data["nrc"].length > 6 ) {
      error["nrc"] = "El NRC debe tener entre 5 y 6 dígitos numéricos";
    }

    if (!this.validatorService.required(data["nombre"])) {
      error["nombre"] = this.errorService.required;
    } else if (!this.validatorService.words(data["nombre"])) {
      error["nombre"] = "Solo se permiten letras y espacios";
    }

    if (!this.validatorService.required(data["seccion"])) {
      error["seccion"] = this.errorService.required;
    }

    if (data["dias"].length === 0) {
      error["dias"] = "Debes seleccionar al menos un día";
    }

    if (!this.validatorService.required(data["hora_inicio"])) {
      error["hora_inicio"] = "La hora de inicio es requerida";
    }
    
    if (!this.validatorService.required(data["hora_fin"])) {
      error["hora_fin"] = "La hora de fin es requerida"; 
    }

    if (data["hora_inicio"] && data["hora_fin"]) {
      if (data["hora_fin"] <= data["hora_inicio"]) {
        error["hora_fin"] = "La hora de fin debe ser mayor a la hora de inicio";
      }
    }

    if (!this.validatorService.required(data["salon"])) {
      error["salon"] = this.errorService.required;
    } else if (!this.validatorService.max(data["salon"], 15)) {
      error["salon"] = this.errorService.max(10);
    }

    if (!this.validatorService.required(data["programa"])) {
      error["programa"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["profesor"])) {
      error["profesor"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["creditos"])) {
      error["creditos"] = this.errorService.required;
    }

    return error;
  }

  public registrarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.post<any>(`${environment.url_api}/materias/`, data, { headers });
  }

  public obtenerListaMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
  }

  public eliminarMateria(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.delete<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
  }

  // Obtener una sola materia por ID
  public getMateriaByID(id: number): Observable<any> {
    // Verificamos si existe el token de sesión
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/materias/?id=${id}`, { headers });
  }

  // Actualizar materia
  public actualizarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.put<any>(`${environment.url_api}/materias/`, data, { headers });
  }
}