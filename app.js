 var express= require('express'); 
 var mongoose= require('mongoose');
 var bodyParser= require('body-parser');
 var app= express();

app.set("view engine","jade");

mongoose.connect("mongodb://localhost/objetos");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



var personaSchema={
	nombre: String,
	apellido: String,
	email: String,
	contrasena:String
};

var User=mongoose.model("",personaSchema);

app.use(express.static("public"));


app.get("/",function(req,res ){
	
	/*var data={
		user:"jmbenavides",
		password:"123"
	}

	var persona= new User(data);

	persona.save(function(err){
		console.log(persona);
	});*/
	res.render("index");
});

app.post("/formulario",function(req,res){
	console.log(req.body);

	var data={
		nombre:req.body.nombre,
		apellido:req.body.apellido,
		email:req.body.email,		
		contrasena:req.body.contrasena,
		usuario:req.body.usuario
	}
	var user = new User(data);

	user.save(function(err){
		console.log(user);
	});

	res.render("formulario/registroexitoso");
});

app.get("/formulario/registro",function(req,res){
	res.render("formulario/registro");
});


app.get("/formulario/iniciarsesion",function(req,res){
	res.render("formulario/iniciarsesion");
});

app.post("/formulario/iniciarsesion",function(req,res){

	User.find(function(error,documento){
		if (error) {
			console.log(error);
		}


		res.render("/cliente/index",{
			Users:documento,
			usuario:req.body.usuario,			
			contrasena:req.body.contrasena
		})
	});


	res.render("formulario/iniciarsesion");
});


app.listen(8080);
