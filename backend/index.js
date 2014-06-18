var express=require("express");
var app = express();


//logger
app.use( require('morgan')("dev") );
//compressing
app.use( require('compression')() );

app.use( require('response-time')() );

//static routes
app.use( require("static-favicon")(__dirname +"/../bin/img/favicon.ico") );
app.use(express.static(__dirname + "/../bin"));


app.use( require('body-parser')( {hash : 'md5'} ) );



//setup express
app.
	set('DEBUG', 'express:*').
	set('view engine', 'jade').
	set('views', __dirname + '/views').
	set('view options', {
		layout: __dirname + '/views/layouts/default.jade'
	});

//pretty print jade html
app.locals.pretty = true;


//import routes
require("./routes")(app);


app.listen(8080);
