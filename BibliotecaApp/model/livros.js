var db = require('./db.js');

exports.insert = function(req, res){
	var nome = req.body.nome;
	var autor = req.body.autor;
	var edicao = req.body.edicao;
	var ano = req.body.ano;

	db.query('INSERT INTO LIVRO (NOME, AUTOR, EDICAO, ANO) VALUES (?, ? ,?',[nome, autor, edicao, ano], function(err, rows){
		if(err){
			console.log(err)
		}else{
			res.redirect('/livros');
		}
	});
}

exports.getAll = function(req, res){
	db.query('SELECT CODIGO, NOME, AUTOR, EDICAO, ANO FROM LIVRO WHERE 1=1', function(err, rows){
		if(err){
			console.log(err)
		}else{
			res.format({
				html:function(){
					res.render('livros/index', {
						title:'Livros',
						"livros": rows
					});
				},
				json:function(){
					res.json(rows);
				}
			});
		}
	});
}

exports.getOne = function(req, res){
	var id = req.params.id;
	db.query('SELECT CODIGO, NOME, AUTOR, EDICAO, ANO FROM LIVRO WHERE CODIGO = ?', [id], function(err, rows){
		if(err){
			console.log(err)
		}else{
			res.format({
				html:function(){
					res.render('lirvos/index',{
						title: 'Livro ' + id,
						"livro": rows
					});
				},
				json: function(){
					res.json(rows);
				}
			});
		}
	});
}


