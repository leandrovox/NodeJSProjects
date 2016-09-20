var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'), //conexão com o mongoose
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

router.use(bodyParser.urlencoded({extended: true}));
router.use(methodOverride(function(req, res){
	if(req.body && typeof req.body == 'object' && '_method' in req.body){
		var method = req.body._method
		delete req.body._method
		return method
	}
}));	
//quando for a rota 'raiz' traz todos os blobs do banco
router.route('/')
	.get(function(req, res, next){
		mongoose.model('Blob').find({}, function(err, blobs){
			if(err){
				return console.error(err);
			}else{
				res.format({
					html:function(){
						res.render('blobs/index', {
								title: 'Pombo!!',
								"blobs": blobs
							});
					},
					json:function(){
						res.json(infophotos);
					}
				});
			}
		})
})
.post(function(req, res){
	var name = req.body.name;
	var badge = req.body.badge;
	var dob = req.body.dob;
	var company = req.body.company;
	var isloved = req.body.isloved;

	mongoose.model('Blob').create({
		name: name,
		badge: badge,
		dob: dob,
		isloved: isloved
	}, function(err, blob){
		if(err){
			res.send('Deu Ruim');
		}else
		{
			console.log('POST criado novo blob: ' + blob);
			res.format({
				html: function(){
					res.location("blobs");
					res.redirect("/blobs");
				},
				json:function(){
					res.json(blob);
				}
			});
		}
	})
});
//});

router.get('/new', function(req, res){
	res.render('blobs/new', {title: 'Add New Blob'});
});

router.param('id', function(req, res, next, id){
	
	mongoose.model('Blob').findById(id, function(err, blob){
		if(err){
			console.log(id + ' não encontrado');
			res.status(404);
			var err = new Error('Não Encontrado');
			err.status = 404;
			res.format({
				html: function(){
					next(err);					
				},
				json: function(){
					res.json({message: err.status + ' ' + err});
				}
			});
		}else{
			req.id = id;
			next();
		}
	});
});

router.route('/:id').get(function(req, res){
	mongoose.model('Blob').findById(req.id, function(err, blob){
		if(err){
			console.log('GET Error: ' + err);
		}else{
			console.log('GET: ' + blob._id);
			var blobdob = blob.dob.toISOString();
			blobdob = blobdob.substring(0, blobdob.indexOf('T'))
			res.format({
				html: function(){
					res.render('blobs/show', {
						"blobdob": blobdob,
						"blob" : blob
					});
				},
				json: function(){
					res.json(blob);
				}
			});
		}
	});
});

router.get('/:id/edit', function(req, res){
		mongoose.model('Blob').findById(req.id, function(err, blob){
			if(err)	{
				console.log('GET Error: ' + err)
			}else{
				console.log('GET: ' + blob._id);

				var blobdob = blob.dob.toISOString();
				blobdob = blobdob.substring(0, blobdob.indexOf('T'))
				res.format({
					html: function(){
						res.render('blobs/edit', {
							"blobdob": blobdob,
							"blob": blob
						});
					},
					json: function(){
						res.json(blob);
					}
				});
			}
		});
	});

router.put('/:id/edit', function(req, res){
	var name = req.body.name;
	var badge = req.body.badge;
	var dob = req.body.dob;
	var company = req.body.company;
	var isloved = req.body.isloved;

	//primeiro encontra o arquivo no Mongo e depois atualiza com os novos valores
	mongoose.model('Blob').findById(req.id, function(err, blob){
		blob.update({
			name: name,
			badge: badge,
			dob: dob,
			isloved: isloved
		}, function(err, blobID){
			if(err){
				res.send('Deu ruim no UPDATE');
			}else{
				res.format({
					html: function(){
						res.redirect("/blobs/" + blob._id);
					},
					json: function(){
						res.json(blob);
					}
				});
			}
		});
	});

});

router.delete('/:id/edit', function(req, res){
	mongoose.model('Blob').findById(req.id, function(err, blob){
		if(err)
		{
			res.send('Deu ruim: ' + err);
		}else{
			blob.remove(function(err, blob){
				if(err){
					res.send('Deu ruim de novo: ' + err);
				}else{
					res.format({
						html: function(){
							res.redirect('/blobs');
						},
						json: function(){
							res.json({
										message: 'deletado', 
										item: blob
									});
						}
					});
				}

			});
		}
	});
});

module.exports = router;