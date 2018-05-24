 var express= require('express'); 
 var dbp= require('mongoose');
 //var dbg= require('mongoose');
 var bodyParser= require('body-parser');
 var app= express();

app.set("view engine","jade");

dbp.connect("mongodb://localhost/personas");

//dbg.connect("mongodb://localhost/grupos");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var personaSchema={
	nombre: String,	
	apellido: String,
	email: String,
	usuario: String,
	contrasena:String,
	proyectos:[]
};

var proyecto={
	nombre:String,
	descripcion:String,
	colaboradores:[],
	tareas:[]
};

var tarea={
	descripcion:String,
	persona:String
}

var User=dbp.model("",personaSchema);
//var Grupo=dbg.model("",grupoSchema);

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
	var person = new User(data);
	person.save(function(err){
		console.log(person);
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
			console.log(index+"indice ");

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

app.get("/cliente/nuevoproyecto",function(req,res){
	
	res.render("cliente/nuevoproyecto",{persona})
});
app.post("/cliente/nuevoproyecto",function(req,res){
	var x=[],y=[];
	var proyect={
		nombre:req.body.nombre,
		descripcion:req.body.descripcion,
		colaboradores:[],
		tareas:[]
	};

	console.log(req.body.nombre);
	x.push(req.body.nombre);
	y.push(persona.nombre);
	persona.proyectos=x;
	res.render("cliente/index",{persona,proyect});

});



app.listen(8080);
