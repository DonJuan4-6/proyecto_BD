const express = require("express");
const cors = require("cors");
const conexion = require("./db") // importar la conexion

const app = express();

// Middlewares globales
app.use(cors()); // Permite recibir peticiones desde el frontend
app.use(express.json()); // Habilitar la lectra de datos en formato JSON

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente")
});

// 1. Obtener todos los productos (READ)
app.get("/productos", (req, res) => {
    const sql = "SELECT * FROM productos";

    conexion.query(sql, (error, resultados) => {
        if (error){
            console.error("Error al consultar: ", error);
            return res.status(500).json({mensaje: 
                "Error al consultar los productos"
            });
        }
        // Retornamos el array de producto como JSON al cliente
        res.json(resultados)
    });
});

// 2. Crear un producto (CREATE)
app.post("/productos", (req, res) => {
    const { nombre, precio, stock } = req.body;

    // consulta parametrizada con '?' para prevenir inyeccion SQL
    const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
    const valores = [nombre, precio, stock];

    conexion.query(sql, valores, (error, resultados) => {
        if (error){
            console.error("Error al insertar: ", error);
            return res.status(500).json({mensaje: 
                "Error al crear el producto"
            });
        }

        res.status(201).json({
            mensaje: "Producto creado correctamente",
        });
    });
});


// 3. Actualizar un producto existente (UPDATE)

app.put("/productos/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, precio, stock } = req.body;

    // consulta parametrizada con '?' para prevenir inyeccion SQL
    const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
    const valores = [nombre, precio, stock, id];

    conexion.query(sql, valores, (error, resultados) => {
        if (error){
            console.error("Error al actualizar producto: ", error);
            return res.status(500).json({mensaje: "Error al actualizar el producto" });
        }

        res.json({
            mensaje: "Producto actualizado correctamente",
        });
    });
});


// 4. Eliminar un producto (DELETE)

app.delete("/productos/:id", (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM productos WHERE id = ?";

    conexion.query(sql, [id], (error, resultado) => {
        if (error){
            console.error("Error al eliminar producto: ", error);
            return res.status(500).json({mensaje: "Error al eliminar el producto" });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "No se encontró el producto" });
        }

        res.json({ mensaje: "Producto eliminado correctamente" });
    });
});




// API del formulario de contacto (CRUD: GET, POST, PUT y DELETE)
app.get("/contactos", (req, res) => {
    const sql = `SELECT id, nombre, correo, asunto, mensaje,
                        DATE_FORMAT(fecha_actualizacion, '%d/%m/%Y %H:%i:%s.%f') AS fecha_actualizacion
                 FROM contactos ORDER BY id DESC`;

    conexion.query(sql, (error, resultados) => {
        if (error) {
            console.error("Error al consultar contactos:", error);
            return res.status(500).json({ mensaje: "Error al consultar los contactos" });
        }

        res.json(resultados);
    });
});

app.get("/contactos/:id", (req, res) => {
    conexion.query(
        `SELECT id, nombre, correo, asunto, mensaje,
                DATE_FORMAT(fecha_actualizacion, '%d/%m/%Y %H:%i:%s.%f') AS fecha_actualizacion
         FROM contactos WHERE id = ?`,
        [req.params.id],
        (error, resultados) => {
            if (error) {
                console.error("Error al consultar el contacto:", error);
                return res.status(500).json({ mensaje: "Error al consultar el contacto" });
            }
            if (resultados.length === 0) {
                return res.status(404).json({ mensaje: "Contacto no encontrado" });
            }

            res.json(resultados[0]);
        }
    );
});

app.post("/contactos", (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;
    const sql = "INSERT INTO contactos (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";

    conexion.query(sql, [nombre, correo, asunto, mensaje], (error, resultado) => {
        if (error) {
            console.error("Error al crear contacto:", error);
            return res.status(500).json({ mensaje: "Error al crear el contacto" });
        }

        res.status(201).json({
            mensaje: "Contacto creado correctamente",
            id: resultado.insertId
        });
    });
});

app.put("/contactos/:id", (req, res) => {
    const { nombre, correo, asunto, mensaje } = req.body;
    const sql = `UPDATE contactos
                 SET nombre = ?, correo = ?, asunto = ?, mensaje = ?,
                     fecha_actualizacion = CURRENT_TIMESTAMP(3)
                 WHERE id = ?`;

    conexion.query(sql, [nombre, correo, asunto, mensaje, req.params.id], (error) => {
        if (error) {
            console.error("Error al actualizar contacto:", error);
            return res.status(500).json({ mensaje: "Error al actualizar el contacto" });
        }

        res.json({ mensaje: "Contacto actualizado correctamente" });
    });
});

app.delete("/contactos/:id", (req, res) => {
    conexion.query("DELETE FROM contactos WHERE id = ?", [req.params.id], (error) => {
        if (error) {
            console.error("Error al eliminar contacto:", error);
            return res.status(500).json({ mensaje: "Error al eliminar el contacto" });
        }

        res.json({ mensaje: "Contacto eliminado correctamente" });
    });
});




// Iniciar servidor en el puerto 3000
app.listen(3000, () =>{
    console.log("Servidor ejecutandose en http://localhost:3000")
});