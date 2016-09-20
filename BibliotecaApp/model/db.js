var mysql = require('mysql');

var connection = mysql.createConnection({
	host = 'localhost',
	user = 'root',
	password = ''
});

module.exports = connection;
