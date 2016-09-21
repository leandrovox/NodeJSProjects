var db = require('./db.js');

exports.insert = function(nome, autor, edicao, ano, done){
	var values = [nome, autor, edicao, ano];

	db.query('INSERT INTO LIVRO (NOME, AUTOR, EDICAO, ANO) VALUES (?, ? ,?, ?)', values, function(err, result){
		if(err){
			console.log(err)
		}else{
			done(null, result.insertId);
		}
	});
}

exports.getAll = function(done){
	db.query('SELECT CODIGO, NOME, AUTOR, EDICAO, ANO FROM LIVRO WHERE 1=1', function(err, rows){
		if(err){
			console.log(err)
		}else{
			done(null, rows);
		}
	});
}

exports.getOne = function(id, done){
	
	db.query('SELECT CODIGO, NOME, AUTOR, EDICAO, ANO FROM LIVRO WHERE CODIGO = ?', [id], function(err, rows){
		if(err){
			console.log(err)
		}else{
			done(null, rows);
		}
	});
}


