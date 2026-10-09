const API_URL = "http://localhost:3000";

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

function cancelarEdicion() {
    formulario.reset();
    productoId.value = "";
    tituloFormulario.textContent = "Registrar producto";
    btnGuardar.textContent = "Guardar Producto";
    btnCancelar.hidden = true;
}

async function guardarProducto(event) {
    event.preventDefault();

    const editando = productoId.value !== "";
    const url = editando
        ? `${API_URL}/productos/${encodeURIComponent(productoId.value)}`
        : `${API_URL}/productos`;
    const producto = {
        nombre: nombreInput.value.trim(),
        precio: Number(precioInput.value),
        stock: Number(stockInput.value)
    };

    btnGuardar.disabled = true;
    try {
        const respuesta = await fetch(url, {
            method: editando ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || `La operación falló (${respuesta.status})`);
        }

        await cargarProductos();
        cancelarEdicion();
    } catch (error) {
        console.error("Error al guardar producto:", error);
    } finally {
        btnGuardar.disabled = false;
    }
}

if (formulario) {
    formulario.addEventListener("submit", guardarProducto);
}

if (btnCancelar) {
    btnCancelar.addEventListener("click", cancelarEdicion);
    btnCancelar.hidden = true;
}

// llamado inicial al cargar la pagina
cargarProductos();