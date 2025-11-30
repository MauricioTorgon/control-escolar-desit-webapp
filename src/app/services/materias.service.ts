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

  public esquemaDias() {
    return {
      Lunes: false,
      Martes: false,
      Miercoles: false,
      Jueves: false,
      Viernes: false
    };
  }
  public esquemaMateria() {
    return {
      'nrc': '',
      'nombre': '',
      'seccion': '',
      'dias': [],
      'horaInicio': '',
      'horaFin': '',
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

    // 1. NRC: Solo números, 5 a 6 dígitos
    if (!this.validatorService.required(data["nrc"])) {
      error["nrc"] = this.errorService.required;
    } else if (!/^[0-9]{5,6}$/.test(data["nrc"])) {
      error["nrc"] = "El NRC debe tener entre 5 y 6 dígitos numéricos";
    }

    // 2. Nombre: Solo letras y espacios
    if (!this.validatorService.required(data["nombre"])) {
      error["nombre"] = this.errorService.required;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(data["nombre"])) {
      error["nombre"] = "Solo se permiten letras y espacios";
    }

    // 3. Sección: Numérico, max 3 dígitos
    if (!this.validatorService.required(data["seccion"])) {
      error["seccion"] = this.errorService.required;
    } else if (!/^[0-9]{1,3}$/.test(data["seccion"])) {
      error["seccion"] = "Máximo 3 dígitos numéricos";
    }

    // 4. Días: Al menos uno (Validado en componente, pero aquí verificamos existencia)
    if (!data["dias"] || data["dias"].length === 0) {
      error["dias"] = "Debes seleccionar al menos un día";
    }

    // 5. Horario
    if (!this.validatorService.required(data["hora_inicio"])) {
      error["horaInicio"] = "La hora de inicio es requerida"; // La clave del error debe ser camelCase para el HTML
    }
    
    if (!this.validatorService.required(data["hora_fin"])) {
      error["horaFin"] = "La hora de fin es requerida"; 
    }

    // 6. Salón: Alfanumérico y espacios, max 15
    if (!this.validatorService.required(data["salon"])) {
      error["salon"] = this.errorService.required;
    } else if (!/^[a-zA-Z0-9 ]{1,15}$/.test(data["salon"])) {
      error["salon"] = "Solo alfanuméricos y espacios (Máx 15 chars)";
    }

    // 7. Programa Educativo
    if (!this.validatorService.required(data["programa"])) {
      error["programa"] = this.errorService.required;
    }

    // 8. Profesor Asignado
    if (!this.validatorService.required(data["profesor"])) {
      error["profesor"] = this.errorService.required;
    }

    // 9. Créditos: Enteros positivos, max 2 dígitos
    if (!this.validatorService.required(data["creditos"])) {
      error["creditos"] = this.errorService.required;
    } else if (!/^[0-9]{1,2}$/.test(data["creditos"])) {
      error["creditos"] = "Máximo 2 dígitos numéricos";
    }

    return error;
  }

  // Servicio para registrar una nueva materia
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

  // Obtener una sola materia por ID (para editar)
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