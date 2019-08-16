import { Component, OnInit, ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__ } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {

  detallefacturaForm: FormGroup
  facturaForm: FormGroup
  table_header: any
  respuestaClientes: any[]
  idcliente: any;
  idmaterial: number;
  precio: number;
  total: number;
  descuento: number;
  cantidad: number;
  carrito: any[] = [];
  idFactura: number;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.getDataFactura()
    this.getDataClientes()
    this.getDataMateriales()
    this.formularioFactura()
    this.formularioDetalleFactura()
    this.idcliente = 999;
    this.idmaterial = 999;
    this.precio = 0;
    this.total = 0;
    this.table_header = [
      {
        id: 'N°',
        fecha: 'Fecha',
        total:'Total',
        idcliente:'Cliente'
      }
    ]    
  }

  guardarId(id){
    sessionStorage.setItem('idFactura',id)
  }

  formularioFactura(){
    this.facturaForm = this.formBuilder.group({
      id:[''],
      fecha:[''],
      total:['',[Validators.required]],
      idcliente:['',[Validators.required]]
    })
  }

  formularioDetalleFactura(){
    this.detallefacturaForm = this.formBuilder.group({
      id:[''],
      cantidad:['',[Validators.required]],
      precio:['',[Validators.required]],
      descuento:['',[Validators.required]],
      idmaterial:['',[Validators.required]],
      idfactura:['',[Validators.required]]
    })
  }

  datosFactura (){
    this.facturaForm.controls['idcliente'].setValue(this.idcliente)
    this.respuestaMateriales.forEach(element =>{
      if(element.id == this.idmaterial){
        this.precio = element.precio
        this.detallefacturaForm.controls['precio'].setValue(this.precio); 
        this.detallefacturaForm.controls['idmaterial'].setValue(this.idmaterial);
      }
    })
  }

//PAGINA PRINCIPAL
respuestaFacturas: any[]

getDataFactura = () => {
  let tabla = 'factura'
  this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
  .subscribe(data => {
    this.respuestaFacturas = data.datos
  })
}

idFacturaVariable: number

getDatabyID = (value) => {
  let tabla = 'factura'
  this.http.get<any>(environment.API_URL + `byid?tabla=${tabla}&&id=${value}`)
  .subscribe( data => {
    this.idFacturaVariable = data.datos[0].id
    localStorage.setItem("id", this.idFacturaVariable.toString() )
  })
}

deleteDataTable = (value) => {
  let tabla = 'factura'

        this.http.delete(environment.API_URL + `?tabla=${tabla}&&id=${value}`)
        .subscribe( data => { 
          console.log(data);
        })
  }
//PAGINA PRINCIPAL

//MODAL NEW FACTURA
nuevafecha = new Date()
fecha_orden = this.nuevafecha.getDate() + "/" + (this.nuevafecha.getMonth() +1) + "/" + this.nuevafecha.getFullYear()


getDataClientes = () => {
  let tabla = 'cliente'
  this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
  .subscribe(data => {
    this.respuestaClientes = data.datos
  })
}

//MODAL NEW FACTURA


postDataFactura = () => {


  

  
  window.location.reload()
}








//MODAL DETALLE_FACTURA
respuestaMateriales: any[]

addProducto(){
  let totalProducto = 0;
  let registro = {
    cantidad: this.cantidad,
    precio: this.precio,
    descuento: this.descuento,
    idmaterial: this.idmaterial,
    idfactura: this.idFactura
  }
  totalProducto = this.cantidad * this.precio 
  this.total += totalProducto; 
 
  this.carrito.push(registro);
  this.idmaterial = 999;
  this.precio = 0
  this.cantidad = 0
  this.descuento = 0
 
  console.log(totalProducto);
}

getDataMateriales = () => {
  let tabla = 'material'
  this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
  .subscribe(data => {
    this.respuestaMateriales = data.datos
  })
}

postDataDetalleFacturas = () => {
  this.facturaForm.controls['total'].setValue(this.total)
  let idcliente = this.facturaForm.get('idcliente').value
  let cantidad = this.detallefacturaForm.get('cantidad').value
  let precio = this.detallefacturaForm.get('precio').value
  let descuento = this.detallefacturaForm.get('descuento').value
  let idmaterial = this.detallefacturaForm.get('idmaterial').value
  let total = this.facturaForm.get('total').value
  let tabla = 'factura'
  let register = {tabla: tabla, datos: [{fecha: this.fecha_orden,total: total, idcliente: idcliente}]}
  this.http.post<any>(environment.API_URL, register)
  .subscribe( data => {
    this.idFactura = data.datos[0];
     console.log(this.idFactura)

    tabla = 'detalle_factura'
    this.http.post(environment.API_URL, this.carrito)
    .subscribe( data => { 
    console.log(data);
    })
  })

  
 
console.log(JSON.stringify(register))
  //window.location.reload()
}
//MODAL DETALLE_FACTURA
}