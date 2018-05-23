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
	usuario: String,
	contrasena:String,
	tareas:[],
	grupo: String
};

var User=mongoose.model("",personaSchema);
app.use(express.static("public"));
app.get("/",function(req,res ){
	res.render("index");
});
app.post("/formulario",function(req,res){
	console.log(req.body);
	var data={
		nombre:req.body.nombre,
		apellido:req.body.apellido,
		email:req.body.email,		
		contrasena:req.body.contrasena,
		usuario:req.body.usuario,
		tareas:null,
		grupo:""
	}
	var persona = new User(data);
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
var sw,persona;
app.post("/cliente/index",function(req,res){
	
	User.find(function(error,documento){
		if (error) {console.log("error");}		
		documento.forEach(function(elemento, index, arreglo){
			console.log(elemento.usuario);
			console.log(elemento.email);
			console.log(elemento.contrasena);
			console.log(req.body.usuario);
			console.log(req.body.contrasena);
			console.log((elemento.usuario == req.body.usuario || elemento.email==req.body.usuario)&& 
				elemento.contrasena == req.body.contrasena);
			console.log("condicional 1")

			if((elemento.usuario == req.body.usuario || elemento.email==req.body.usuario)&& 
				elemento.contrasena == req.body.contrasena){
				persona=elemento;
				console.log(persona);
				console.log("persona");
				sw=true;

			}		
		});
		console.log(sw+ " hi");
		console.log("condicional 2")
		if(sw){
			res.render("cliente/index",{persona});
		}else{
			res.send("este usuario no existe");	
		}
	});
	
	
});



app.listen(8080);
