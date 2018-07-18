var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'nodejs',
  password : '1q2w3e4r',
  database : 'opentutorials'
});
db.connect();

module.exports = db;
