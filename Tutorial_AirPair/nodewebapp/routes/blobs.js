var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'), //conexão com o mongoose
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

router.use(bodyParser.urlencoded({extended: true}))
router.use(methodOverride(function(req, res){
	if(req.body && typeof req.body == 'object' && '_method' in req.body){
		var method = req.body._method
		delete req.body._method
		return method
	}
})	
//quando for a rota 'raiz' traz todos os blobs do banco
router.route('/')
	.get(function(req, res, next){
		mongoose.model('Blob').find({}, function(err, blobs){
			if(err){
				return console.error(err);
			}else{
				res.format({
					html:function(){
						res.render('blobs/index',{
							titles: 'All my Blobs',
							"blobs": blobs
						});
					},
					json: function(){
						res.json(infophotos);
					}
				});
			}
		});
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
			isloved: islove
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

	router.get('/new', function(req, res){
		res.render('blobs/new', {title: 'Add New Blob'});
	});

	router.params('id', function(req, res, next, id){
		
		mongoose.model('Blob').findById(id, function(err, blob){
			if(err){
				console.log(id + ' não encontrado');
				res.status(404)
				var err new Error('Não Encontrado');
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