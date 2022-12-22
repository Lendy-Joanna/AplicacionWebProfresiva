
//indexdb
// variables para traer los datos desde el index y crear base
var bd = new PouchDB("comentario");
  $nombreCompleto = document.querySelector("#nombreCompleto"),
  $comentario = document.querySelector("#comentario"),
  $telefono = document.querySelector("#telefono"),
  $btnGuardar = document.querySelector("#btnGuardar"),
  $btnGuardarCambios = document.querySelector("#btnGuardarCambios"),
  $btnCancelarEdicion = document.querySelector("#btnCancelarEdicion"),
  $cuerpoTabla = document.querySelector("#cuerpoTabla"),
  idTemporalContacto = null, 
  revTemporalContacto = null; 

  //Guardar Comenatrio
  $btnGuardar.addEventListener("click", function() {
    var nombreCompleto = $nombreCompleto.value,
      comentario = $comentario.value,
      telefono = $telefono.value;
  
    if (nombreCompleto && comentario && telefono) {
      bd.post({
          nombre: nombreCompleto,
          comentario: comentario,
          telefono: telefono
        })
        .then(function(respuesta) {
          if (respuesta.ok) {
            consultarContactos();
            alert("Guardado correctamente");
            //Limpiar formulario
            cancelarEdicion(); 
          }
        });
    }
  });
  //Funcion donde el boton cancela todo
  $btnCancelarEdicion.addEventListener("click", function() {
    cancelarEdicion();
  });

  //boton para guardar cambios
  $btnGuardarCambios.addEventListener("click", function() {
    var nombreCompleto = $nombreCompleto.value,
      comentario = $comentario.value,
      telefono = $telefono.value;
  
    if (nombreCompleto && comentario && telefono) {
      bd.put({
          nombre: nombreCompleto,
          comentario: comentario,
          telefono: telefono,
          _id: idTemporalContacto,
          _rev: revTemporalContacto
        })
        .then(function(respuesta) {
          if (respuesta.ok) {
            consultarContactos();
            alert("Cambios guardados");
            cancelarEdicion();
          }
        });
    }
  });
  //funciones para editar y cancelar edicion
  var prepararParaEditar = function() {
    $btnGuardar.style.display = "none";
    $btnGuardarCambios.style.display = "block";
    $btnCancelarEdicion.style.display = "block";
  
  };
  
  var cancelarEdicion = function() {
    $btnGuardar.style.display = "block";
    $btnGuardarCambios.style.display = "none";
    $btnCancelarEdicion.style.display = "none";
  
    $nombreCompleto.value = $comentario.value = $telefono.value = "";
  
    idTemporalContacto = null;
    revTemporalContacto = null;
  };
  //consulta de reguistros
  var consultarContactos = function() {
    bd.allDocs({
      include_docs: true
    }).then(function(documentos) {
      var htmlCuerpoTabla = "";
      for (var i = 0; i < documentos.rows.length; i++) {
        var contacto = documentos.rows[i].doc;
        htmlCuerpoTabla += "<tr>";
  
        htmlCuerpoTabla += "<td>";
        htmlCuerpoTabla += contacto.nombre;
        htmlCuerpoTabla += "</td>";

        htmlCuerpoTabla += "<td>";
        htmlCuerpoTabla += contacto.telefono;
        htmlCuerpoTabla += "</td>";

        htmlCuerpoTabla += "<td>";
        htmlCuerpoTabla += contacto.comentario;
        htmlCuerpoTabla += "</td>";
  
  
        htmlCuerpoTabla += "<td>";
        htmlCuerpoTabla += "<button class='btn-editar' data-id-contacto='" + contacto._id + "'>Editar</button>";
        htmlCuerpoTabla += "</td>";
  
        //Nuevo botón
        htmlCuerpoTabla += "<td>";
        htmlCuerpoTabla += "<button class='btn-eliminar' data-id-contacto='" + contacto._id + "'>Eliminar</button>";
        htmlCuerpoTabla += "</td>";
  
        htmlCuerpoTabla += "</tr>";
      }
  
      $cuerpoTabla.innerHTML = htmlCuerpoTabla; //Asignar HTML concatenado
  
  
      //Una vez dibujados los botones, los escuchamos
      escucharBotonesEditar();
      escucharBotonesEliminar();
  
    });
  };
  
  //funciones para editar y elimnar el contacto listado
  var escucharBotonesEditar = function() {
    var botonesEditar = document.getElementsByClassName("btn-editar");
    for (var i = 0; i < botonesEditar.length; i++) {
      botonesEditar[i].addEventListener('click', editarContacto);
    }
  };
  var escucharBotonesEliminar = function() {
    var botonesEliminar = document.getElementsByClassName("btn-eliminar");
    for (var i = 0; i < botonesEliminar.length; i++) {
      botonesEliminar[i].addEventListener('click', eliminarContacto);
    }
  };
  
  var eliminarContacto = function() {
  
    //Detener si no se confirma
    if (!confirm("¿Seguro?")) return;
  
    var idContacto = this.dataset.idContacto;
    
    obtenerUnContacto(idContacto)
      .then(function(contacto) {
        return contacto;
      })
      .then(function(contacto) {
        return bd.remove(contacto).then(function(respuesta) {
          return respuesta;
        });
      })
      .then(function(respuesta) {
        if (respuesta.ok) {
          alert("Eliminado correctamente");
          consultarContactos();
        }
      });
  
  };

  var editarContacto = function() {
    // Acceder a data-id-contacto
    // Javascript remueve los guiones y el "data", luego
    // pone todos los datos en un objeto llamado dataset
    // y convierte dichos guiones a camelCase
    // Ejemplo: data-id-contacto => dataset.idContacto
  
    var idContacto = this.dataset.idContacto;
    obtenerUnContacto(idContacto).then(function(contacto) {
  
      //Ocultar y mostrar botones respectivos
      prepararParaEditar();
  
      $nombreCompleto.value = contacto.nombre;
      $comentario.value = contacto.comentario;
      $telefono.value = contacto.telefono;
  
      idTemporalContacto = contacto._id;
      revTemporalContacto = contacto._rev;
    });
  };
  
  var obtenerUnContacto = function(idContacto) {
    return bd.get(idContacto).then(function(contacto) {
      return contacto;
    });
  };
  
  //Por defecto, ocultar botones que sólo se muestran al editar
  cancelarEdicion();
  
  consultarContactos();