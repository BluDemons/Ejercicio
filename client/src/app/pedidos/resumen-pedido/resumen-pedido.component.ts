import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-resumen-pedido',
  templateUrl: './resumen-pedido.component.html',
  styleUrls: ['./resumen-pedido.component.scss']
})
export class ResumenPedidoComponent implements OnInit {

  table_header: any
  detallepedidosForm: FormGroup

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.formularioDetallePedidos()

    this.getDataDetallePedido()
    this.getDataMateriales()
    this.getDataSubtotal()
    this.getDataIva()
    // this.getDataTotal()
    // this.getPDF()

    this.table_header = [
      {
        idmaterial: 'Material',
        cantidad: 'Cantidad',
        valor_unitario: 'Valor Unitario',
        valor_total: 'Valor Total'
      }
    ]
  }

  formularioDetallePedidos(){
    this.detallepedidosForm = this.formBuilder.group({
      cantidad: ['',[Validators.required, Validators.pattern('[0-9]')]],
      idmaterial: ['',[Validators.required]],
    });
  }

  //PAGINA PRINCIPAL
  getLocalStorage(){
    let id = localStorage.getItem("id")
    return id
  }

  respuestaDetallePedido: any[]

  getDataDetallePedido = () => {
    this.http.get<any>(environment.API_URL + `PedidosAPI?idpedido=${this.getLocalStorage()}`)
    .subscribe(data => {
      this.respuestaDetallePedido = data.datos
    })
  }

  respuestaSubtotal: any[]

  getDataSubtotal = () => {
    let subtotal = "sum(detalle_pedido.cantidad*material.precio) as subtotal"

    this.http.get<any>(environment.API_URL + `PedidosSel?idpedido=${this.getLocalStorage()}&consulta=${subtotal}`)
    .subscribe(data => {
      this.respuestaSubtotal = data.datos
    })
  }

  respuestaIva: any[]

  getDataIva = () => {
    let iva = "round(sum(detalle_pedido.cantidad*material.precio)*0.12,2) as iva"

    this.http.get<any>(environment.API_URL + `PedidosSel?idpedido=${this.getLocalStorage()}&consulta=${iva}`)
    .subscribe(data => {
      this.respuestaIva = data.datos
    })
  }

  respuestaTotal: any[]

  getDataTotal = () => {
    let total = "(sum(detalle_pedido.cantidad*material.precio) + round(sum(detalle_pedido.cantidad*material.precio)*0.12,2)) as total"

    this.http.get<any>(environment.API_URL + `PedidosSel?idpedido=${this.getLocalStorage()}&consulta=${total}`)
    .subscribe(data => {
      this.respuestaTotal = data.datos
    })
  }

  deleteDataTable = (value) => {
    let tabla = 'detalle_pedido'
    this.http.delete(environment.API_URL + `?tabla=${tabla}&&id=${value}`)
    .subscribe( data => { })
  }
  //PAGINA PRINCIPAL

  
  //MODAL DETALLE PEDIDO 
  respuestaMateriales: any[]

  getDataMateriales = () => {
    let tabla = 'material'
    this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
    .subscribe(data => {
        this.respuestaMateriales = data.datos
    })
  }
  
  postDataDetallePedidos = () => {
    let cantidad = this.detallepedidosForm.get('cantidad').value
    let idmaterial = this.detallepedidosForm.get('idmaterial').value

    let tabla = 'detalle_pedido'

    if(this.detallepedidosForm.invalid){
      Swal.fire({
        type: 'error',
        title: 'Ups!',
        text: 'Datos inválidos'
      })
    }else{
      let register = {tabla: tabla, datos: [{
                                              cantidad: cantidad, 
                                              idpedido: this.getLocalStorage(),
                                              idmaterial: idmaterial
                                            }]}
      this.http.post(environment.API_URL, register)
      .subscribe( data => { })
      //window.location.reload()
    }
  }
  //MODAL DETALLE PEDIDO

  // JSPDF

  docPdf: jsPDF;
  pdfData: any[]

  getPDF = () => {
    let ruta = 'pdf'
    let tabla = 'pedido'

    this.http.get<any>(environment.API_URL + `${ruta}?tabla=${tabla}`)
    .subscribe(data => {
      this.pdfData = data.datos
    })
    console.log(this.pdfData)
  }

  pdf() {
    let textSize=10;
    let anchoTotal=210
    let altoTotal=290
    let margenSup=25
    let margeninf=25
    let margeniz=25
    let margende= 25
    let anchouso= anchoTotal-margeniz-margende
    let altouso=altoTotal-margenSup-margeninf
    let x=25;
    let y=25;

    let doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'A4',
      compress: true,
    })
    var headers = 
    {
      id: "N° Pedido",
      fecha: "Fecha Del Pedido",
      total: "Total de Pedidos",
      idproveedor: "Nombre Del Proveedor",
    };
    doc.autoTable({
      head: [headers],
      body: this.pdfData, colSpan: 2, rowSpan: 2, styles: {halign: 'center'},
    })
    doc.save('Pedidos.pdf')
  }

// JSPDF
}