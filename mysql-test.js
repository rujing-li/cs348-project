const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'cs348cs348',
  database: 'RideShare',
  port: 3306
});

connection.connect();

connection.end();