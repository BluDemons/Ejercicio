;
let config = require('../knexfile')
let env = 'development'
let db = require('knex')(config[env])

let getDatos = (req, res) => {
    let tabla = req.query.tabla
    let campo = req.query.campo
    db.select(campo).from(tabla)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}

let postDatos = (req, res) => {
    let tabla = req.body.tabla
    let datos = req.body.datos
    db(tabla).returning('id').insert(datos)
    .then(resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado
        })
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}

let updateDatos = (req, res) => {
    let tabla = req.body.tabla
    let datos = req.body.datos
    datos.forEach( element => {
        db(tabla).where('id', element.id).update(element)
        .then( resultado => {
            return res.status(200).json({
                ok: true,
                datos: resultado
            })
        })
        .catch((error) => {
            return res.status(500).json({
                ok: false,
                datos: null,
                mensaje: `Error del servidor: ${error}` 
            })
        })
    })
}

let deleteDatos = (req, res) => {
    let tabla = req.query.tabla
    let id = req.query.id
    db(tabla).where('id', id).delete()
    .then(resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}

let getDatosbyID = (req, res) => {
    let tabla = req.query.tabla
    let campo = req.query.campo
    let id = req.query.id
    db.select(campo).from(tabla).where('id', id)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}
//SELECT DE DETALLES SISTEMA
let getDatosPedidos_detalles = (req, res) => {
    let idpedido = req.query.idpedido
    db.raw(`select * from detalle_pedido where idpedido = ${idpedido}`)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado.rows
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}
let getDatosAlbaran_detalles = (req, res) => {
    let idalbaran = req.query.idalbaran
    db.raw(`select * from detalle_albaran where idalbaran = ${idalbaran}`)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado.rows
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}

let getDatosReclamo_detalles = (req, res) => {
    let idreclamo = req.query.idreclamo
    db.raw(`select * from detalle_reclamo where idreclamo = ${idreclamo}`)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado.rows
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}

let getDatosFactura_detalles = (req, res) => {
    let idfactura = req.query.idfactura
    db.raw(`select * from detalle_factura where idfactura = ${idfactura}`)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado.rows
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}

let getPedidoSelect = (req, res) => {
    db.raw(`select Pe.id,current_date Fecha,Pe.total,P.nombre from pedido Pe join proveedor P on pe.idproveedor=P.id`)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado.rows
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}
let getPedidosPP = (req, res) => {
    db.raw(`select pedido.id, proveedor.nombre as idproveedor, pedido.fecha as fecha from pedido join proveedor on pedido.idproveedor = proveedor.id`)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado.rows
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}
let getPedidosSel = (req, res) => {
    let idpedido = req.query.idpedido
    let consulta = req.query.consulta

    db.raw(`select detalle_pedido.idpedido, ${consulta} from detalle_pedido join material on detalle_pedido.idmaterial = material.id where idpedido = ${idpedido} group by detalle_pedido.idpedido`)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado.rows
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}
let getDatosPedidos_detalle = (req, res) => {
    let idpedido = req.query.idpedido

    db.raw(`select detalle_pedido.idpedido, detalle_pedido.cantidad, material.nombre as idmaterial, material.precio as valor_unitario, (material.precio*detalle_pedido.cantidad) as valor_total from detalle_pedido join material on detalle_pedido.idmaterial = material.id where  detalle_pedido.idpedido = ${idpedido}`)
    .then( resultado => {
        return res.status(200).json({
            ok: true,
            datos: resultado.rows
        }) 
    })
    .catch((error) => {
        return res.status(500).json({
            ok: false,
            datos: null,
            mensaje: `Error del servidor: ${error}` 
        })
    })
}

//SELECT DE DETALLES SISTEMA

module.exports = {
    getDatos,
    postDatos,
    updateDatos,
    deleteDatos,
    getDatosbyID,
    getDatosPedidos_detalle,
    getDatosPedidos_detalles,
    getDatosReclamo_detalles,
    getDatosFactura_detalles,
    getDatosAlbaran_detalles,
    getPedidoSelect,    
    getPedidosPP,
    getPedidosSel,

}