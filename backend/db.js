const mysql = require("mysql2");

// CONFIGURACION DE LA CONEXION A MYSQL
const conexion = mysql.createConnection({
    host: "localhost", // SERVIDOR LOCAL
    user: "root", //Usuario por Defecto
    database: "tienda" // BASE DE DATOS
});

// Comprobar si la conexion fue exitosa
conexion.connect((error) => {
    if (error) {
        console.error("Error al conectar cn MySQL 😢 :", error);
        return;
    }
    console.log("Conexion exitosa con MySQL");
});

// Exportar la conexion para reutilizarla en las rutas de servidor
module.exports = conexion;