var express= require('express'); 
var dbp= require('mongoose');
var bodyParser= require('body-parser');
var method_override= require('method-override')

var app= express();


dbp.connect("mongodb://localhost/objetos");

//dbg.connect("mongodb://localhost/grupos");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(method_override("_method"));
app.set("view engine","jade");






var personaSchema={
	nombre: String,	
	apellido: String,
	email: String,
	usuario: String,
	contrasena:String,
	proyectos:[]
};

var User=dbp.model("personas",personaSchema);
//var Grupo=dbg.model("",grupoSchema);

app.use(express.static("public"));

app.get("/",function(req,res ){
	res.render("index");
});

app.post("/formulario",function(req,res){
	var data={
		nombre:req.body.nombre,
		apellido:req.body.apellido,
		email:req.body.email,		
		contrasena:req.body.contrasena,
		usuario:req.body.usuario,
		proyectos:[]
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

var persona;
app.post("/cliente/index",function(req,res){
	User.findOne({"usuario": req.body.usuario},function(error,person){
		
		persona=person;
		if(person != null){
			res.render("cliente/index",{persona});	
		}else{
			res.send("este usuario no existe");	
		}
		
	})
});

app.get("/cliente/nuevoproyecto",function(req,res){
	
	res.render("cliente/nuevoproyecto",{persona})
});

app.get("/cliente",function(req,res){
	
	res.render("cliente/index",{persona})
});

app.put("/cliente/:id",function(req,res){
	
	var x=[];

	var proyect={
		nombre:req.body.nombre,
		master:persona.usuario,
		descripcion:req.body.descripcion,
		colaboradores:[],
		tareas:[]
	};
	console.log(proyect.nombre);
	console.log(proyect.master);
	console.log(proyect.descripcion);
	console.log(proyect.colaboradores);
	console.log(proyect.tareas);



	persona.proyectos.push(proyect);
		
	var dat={
		proyectos:persona.proyectos
	}
	User.update({"_id": req.params.id},dat,function(personay){
		console.log(persona); 	
		res.render("cliente/index",{persona});

	});

});


app.get("/proyecto/:num",function(req,res){
	var creador,descripcion,cols,tareas;
	console.log(persona);
	persona.proyectos.forEach(function(item){
		
		if(item.nombre==req.params.num){
			creador=item.master;
			descripcion=item.descripcion;
			cols=item.colaboradores;
			tareas=item.tareas;
		}


	});


	res.render("cliente/proyecto",{nombre:req.params.num,persona,creador,descripcion,cols,tareas});
});






app.listen(8080);
