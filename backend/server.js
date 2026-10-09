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


// 3. Eliminar un producto (DELETE)

app.delete("/productos/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, precio, stock } = req.body;

    // consulta parametrizada con '?' para prevenir inyeccion SQL
    const sql = "DELETE FROM productos WHERE id = ?";
    const valores = [id];

    conexion.query(sql, valores, (error, resultados) => {
        if (error){
            console.error("Error al eliminar producto: ", error);
            return res.status(500).json({mensaje: "Error al eliminar el producto" });
        }

        res.json({mensaje: "Producto eliminado correctamente"});
    });
});


// Iniciar servidor en el puerto 3000
app.listen(3000, () =>{
    console.log("Servidor ejecutandose en http://localhost:3000")
});