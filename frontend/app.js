const API_URL = "https://proyecto-bd2-8y1j.onrender.com";

// ELEMENTOS DEL DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");

// ELEMENTOS DEL DOM CONTACTO
const listaContactos = document.getElementById("listaContactos");
const formularioContacto = document.getElementById("formularioContacto");
const contactoId = document.getElementById("contactoId");
const contactoNombreInput = document.getElementById("contactoNombre");
const correoInput = document.getElementById("correo");
const asuntoInput = document.getElementById("asunto");
const mensajeInput = document.getElementById("mensaje");
const btnGuardarContacto = document.getElementById("btnGuardarContacto");
const btnCancelarContacto = document.getElementById("btnCancelarContacto");
const tituloFormularioContacto = document.getElementById("tituloFormularioContacto");
const estadoContactos = document.getElementById("estadoContactos");


// 1. Funcion para consultar los productos y mostrarlos en el DOM (READ)
async function cargarProductos() {
    if (!listaProductos) return;

    try {
        const respuesta = await fetch(`${API_URL}/productos`);
        if (!respuesta.ok) {
            throw new Error(`La consulta de productos falló (${respuesta.status})`);
        }

        const productos = await respuesta.json();
        listaProductos.innerHTML = "";

        if (productos.length === 0) {
            listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos disponibles</p>";
            return;
        }

        productos.forEach((producto) => {
            const elemento = document.createElement("div");
            elemento.classList.add("producto");

            const detalles = document.createElement("div");
            const nombre = document.createElement("h3");
            nombre.textContent = producto.nombre;

            const precio = document.createElement("p");
            precio.classList.add("producto-precio");
            precio.textContent = `Precio: $${producto.precio}`;

            const stock = document.createElement("p");
            stock.textContent = `Stock: ${producto.stock} unidades`;

            const acciones = document.createElement("div");
            acciones.classList.add("acciones");

            const btnEditar = document.createElement("button");
            btnEditar.classList.add("btn-editar");
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => {
                cargarEnFormulario(producto.id, producto.nombre, producto.precio, producto.stock);
            });

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn-eliminar");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.addEventListener("click", () => eliminarProducto(producto.id));

            detalles.append(nombre, precio, stock);
            acciones.append(btnEditar, btnEliminar);
            elemento.append(detalles, acciones);
            listaProductos.appendChild(elemento);
        });
    } catch (error) {
        console.error("Error al cargar productos:", error);
        listaProductos.textContent = `No se pudieron cargar los productos: ${error.message}`;
    }
}

// 2. Cargar datos del producto en el formulario para editar (UPDATE)
function cargarEnFormulario(id, nombre, precio, stock) {
    productoId.value = id;
    nombreInput.value = nombre;
    precioInput.value = precio;
    stockInput.value = stock;

    tituloFormulario.textContent = "Editar Producto";
    btnGuardar.textContent = "Actualizar Producto";
    btnCancelar.hidden = false;
    nombreInput.focus();
}

// Cancelar edicion y restaurar formulario
function cancelarEdicion() {
    formulario.reset();
    productoId.value = "";
    tituloFormulario.textContent = "Registrar producto";
    btnGuardar.textContent = "Guardar Producto";
    btnCancelar.hidden = true;
}
if (btnCancelar){
    btnCancelar.addEventListener("click", cancelarEdicion);
}


// 3. Guardar o actualizar segun si hay un ID seleccionado (CREATE o UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que la página se recargue

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        // MODO ACTUALIZAR (PUT)
        const respuesta = await fetch(`${API_URL}/productos/${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
        if (!respuesta.ok) {
          throw new Error(`No se pudo actualizar el producto (${respuesta.status})`);
        }
      } else {
        // MODO CREAR (POST)
        const respuesta = await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
        if (!respuesta.ok) {
          throw new Error(`No se pudo crear el producto (${respuesta.status})`);
        }
      }

      cancelarEdicion(); // Limpiar formulario y restaurar botones
      await cargarProductos(); // Refrescar la lista en pantalla
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      window.alert(`Error al guardar el producto: ${error.message}`);
    }
  });
}


// Boton de eliminar un producto (DELETE)
// 4. Eliminar un producto (DELETE)
async function eliminarProducto(id) {
  const confirmar = window.confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(resultado.mensaje || `No se pudo eliminar el producto (${respuesta.status})`);
    }

    if (String(productoId.value) === String(id)) {
      cancelarEdicion();
    }

    await cargarProductos();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    window.alert(`Error al eliminar el producto: ${error.message}`);
  }
}


// CARGA Y RENDERIZADO DE CONTACTOS
async function cargarContactos() {
    if (!listaContactos) return false;

    if (estadoContactos) {
        estadoContactos.textContent = "Cargando contactos...";
    }

    try {
        const respuesta = await fetch(`${API_URL}/contactos`);
        if (!respuesta.ok) {
            const resultado = await respuesta.json();
            throw new Error(resultado.mensaje || `La consulta falló (${respuesta.status})`);
        }

        const contactos = await respuesta.json();
        listaContactos.innerHTML = "";

        if (contactos.length === 0) {
            if (estadoContactos) {
                estadoContactos.textContent = "Todavía no hay contactos registrados.";
            }
            return true;
        }

        if (estadoContactos) {
            estadoContactos.textContent = "";
        }

        contactos.forEach((contacto) => {
            const elemento = document.createElement("div");
            elemento.classList.add("contacto");

            const detalles = document.createElement("div");
            const nombreElemento = document.createElement("h3");
            nombreElemento.textContent = contacto.nombre;

            const correoElemento = document.createElement("p");
            correoElemento.classList.add("contacto-correo");
            correoElemento.textContent = `Correo: ${contacto.correo}`;

            const asuntoElemento = document.createElement("p");
            asuntoElemento.textContent = `Asunto: ${contacto.asunto}`;

            const mensajeElemento = document.createElement("p");
            mensajeElemento.classList.add("contacto-mensaje");
            mensajeElemento.textContent = `Mensaje: ${contacto.mensaje}`;

            const fechaElemento = document.createElement("p");
            fechaElemento.classList.add("contacto-fecha");
            fechaElemento.textContent = `Fecha y hora de envío o última edición: ${contacto.fecha_actualizacion}`;

            const acciones = document.createElement("div");
            acciones.classList.add("acciones");

            const btnEditar = document.createElement("button");
            btnEditar.type = "button";
            btnEditar.classList.add("btn-editar");
            btnEditar.textContent = "Editar";
            btnEditar.addEventListener("click", () => {
                cargarContactoEnFormulario(contacto);
            });

            const btnEliminar = document.createElement("button");
            btnEliminar.type = "button";
            btnEliminar.classList.add("btn-eliminar");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.addEventListener("click", () => eliminarContacto(contacto.id));

            detalles.append(nombreElemento, correoElemento, asuntoElemento, mensajeElemento, fechaElemento);
            acciones.append(btnEditar, btnEliminar);
            elemento.append(detalles, acciones);
            listaContactos.appendChild(elemento);
        });
        return true;
    } catch (error) {
        console.error("Error al cargar contactos:", error);
        if (estadoContactos) {
            estadoContactos.textContent = `No se pudieron cargar los contactos: ${error.message}`;
        }
        return false;
    }
}

function cargarContactoEnFormulario(contacto) {
    contactoId.value = contacto.id;
    contactoNombreInput.value = contacto.nombre;
    correoInput.value = contacto.correo;
    asuntoInput.value = contacto.asunto;
    mensajeInput.value = contacto.mensaje;

    tituloFormularioContacto.textContent = "Editar contacto";
    btnGuardarContacto.textContent = "Actualizar contacto";
    btnCancelarContacto.hidden = false;
    contactoNombreInput.focus();
}

function cancelarEdicionContacto() {
    formularioContacto.reset();
    contactoId.value = "";
    tituloFormularioContacto.textContent = "Contacto";
    btnGuardarContacto.textContent = "Guardar contacto";
    btnCancelarContacto.hidden = true;
}

async function guardarContacto(event) {
    event.preventDefault();

    const editando = contactoId.value !== "";
    const url = editando
        ? `${API_URL}/contactos/${encodeURIComponent(contactoId.value)}`
        : `${API_URL}/contactos`;
    const contacto = {
        nombre: contactoNombreInput.value.trim(),
        correo: correoInput.value.trim(),
        asunto: asuntoInput.value.trim(),
        mensaje: mensajeInput.value.trim()
    };

    btnGuardarContacto.disabled = true;
    try {
        const respuesta = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contacto)
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || `La operación falló (${respuesta.status})`);
        }

        const listaActualizada = await cargarContactos();
        cancelarEdicionContacto();
        if (listaActualizada && estadoContactos) {
            estadoContactos.textContent = resultado.mensaje;
        }
    } catch (error) {
        console.error("Error al guardar contacto:", error);
        if (estadoContactos) {
            estadoContactos.textContent = `No se pudo guardar el contacto: ${error.message}`;
        }
    } finally {
        btnGuardarContacto.disabled = false;
    }
}

async function eliminarContacto(id) {
    if (!window.confirm("¿Seguro que deseas eliminar este contacto?")) {
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/contactos/${encodeURIComponent(id)}`, {
            method: "DELETE"
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || `La eliminación falló (${respuesta.status})`);
        }

        if (contactoId.value === String(id)) {
            cancelarEdicionContacto();
        }
        const listaActualizada = await cargarContactos();
        if (listaActualizada && estadoContactos) {
            estadoContactos.textContent = resultado.mensaje;
        }
    } catch (error) {
        console.error("Error al eliminar contacto:", error);
        if (estadoContactos) {
            estadoContactos.textContent = `No se pudo eliminar el contacto: ${error.message}`;
        }
    }
}

if (formularioContacto) {
    formularioContacto.addEventListener("submit", guardarContacto);
}

if (btnCancelarContacto) {
    btnCancelarContacto.addEventListener("click", cancelarEdicionContacto);
    btnCancelarContacto.hidden = true;
}





// llamado inicial al cargar la pagina
cargarProductos();
cargarContactos();