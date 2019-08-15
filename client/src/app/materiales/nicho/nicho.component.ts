import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nicho',
  templateUrl: './nicho.component.html',
  styleUrls: ['./nicho.component.scss']
})
export class NichoComponent implements OnInit {

  table_header: any
  nichoForm: FormGroup
  detallereclamosForm: FormGroup
  nombre:string

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getDataNicho()
    this.formularioNicho()

    this.table_header = [
      {
        id: 'N°',
        nombre: 'Nombre Nicho',
      }
    ]
  }

  formularioNicho(){
    this.nichoForm = this.formBuilder.group({
      id: [''],
      nombre: ['',[Validators.required,Validators.pattern('[A-Z]{1}[a-z]{4,10}')]],
    });
  }

  //PAGINA PRINCIPAL
  respuestaNicho: any[]

  getDataNicho = () => {
    let tabla = 'nicho'
    this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
    .subscribe(data => {
        this.respuestaNicho = data.datos
    })
  }

  deleteDataTable = (value) => {
    let tabla = 'nicho'
    this.http.delete(environment.API_URL + `?tabla=${tabla}&&id=${value}`)
    .subscribe( data => { })
    window.location.reload()
  }
  //PAGINA PRINCIPAL

  //MODAL NEW RECLAMO

  postDataNicho = () => {
    let id
    let nombre = this.nichoForm.get('nombre').value

    let tabla = 'nicho'
    let register = {tabla: tabla, datos: [{ id: id, nombre: nombre}]}
    this.http.post(environment.API_URL, register)
    .subscribe( data => {
      // this.postData = data
    })
    window.location.reload()
  }

  validaLoginForm(){
    if(this.nichoForm.valid){
      this.nombre = JSON.stringify(console.log(this.nichoForm.controls['name'].value))
      alert(['Datos Enviados'])
    }else{
      this.nombre = JSON.stringify(console.log(this.nichoForm.controls['name'].errors))
      }
    }
    
  public getError(controlName: string): string {
    let error = '';
    const control = this.nichoForm.get(controlName);
    if (control.touched && control.errors != null) {
      error = JSON.stringify(control.errors);
    }
    return error;
  }
}