var express = require('express'),
	router = express.Router(),
	dbMysql = require('../model/livro'), //conexão com o mongoose
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

router.use(bodyParser.urlencoded({extended: true}));
router.use(methodOverride(function(req, res){
	if(req.body && typeof req.body == 'object' && '_method' in req.body){
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));


router.route('/')
	.get(function(req, res, next){
		var rows = dbMysql.getAll();

		
		res.format({
			html: function(){
				res.render('livros/index',{
					title: 'Livros',
					"livros": rows
				});
			},
			json: function(){
				res.json(rows);
			}
		});
	});

module.exports = router;	