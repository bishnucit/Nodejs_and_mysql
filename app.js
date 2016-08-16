var express = require('express');
var app = express();
var mysql = require('mysql');
var connection = mysql.createConnection({

  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'mydb'
});
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

	
//connection.connect();

connection.query('SELECT * from mytable1', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});

//connection.end();
// Binding express app to port 3000
app.listen(3000,function(){
    console.log('Node server running @ http://localhost:3000')
});


app.use('/node_modules',  express.static(__dirname + '/node_modules'));

app.use('/style',  express.static(__dirname + '/style'));

app.get('/',function(req,res){
    res.sendFile('home.html',{'root': __dirname + '/templates'});
});


app.get('/showSignInPage',function(req,res){
    res.sendFile('signin.html',{'root': __dirname + '/templates'});
});
app.get('/showSignInPageretry',function(req,res){
    res.sendFile('signinretry.html',{'root': __dirname + '/templates'});
});
app.get('/showSignUpPage',function(req,res){
  res.sendFile('signup.html',{'root':__dirname + '/templates'})
});

app.get('/message',function(req,res){
    res.sendFile('message.html',{'root': __dirname + '/templates'});
});

app.get('/loggedin',function(req,res){
    res.sendFile('loggedin.html',{'root': __dirname + '/templates'});
});


app.post('/myaction', function(req, res) {
	console.log('req.body');
	console.log(req.body);
	var record = {email: req.body.email, pass: req.body.pass};

	//connection.connect();
	connection.query('INSERT INTO mytable1 SET ?', record, function(err,res){
	  	if(err) throw err;
		console.log('Last record insert id:', res.insertId);
		
	});

	res.redirect('/message');
	//connection.end();

	res.end();
});


app.post('/verifyuser', function(req,res){
	console.log('checking user in database');
	console.log(req.body.pass);
	var selectString = 'SELECT COUNT(email) FROM mytable1 WHERE email="'+req.body.email+'" AND pass="'+req.body.pass+'" ';
	 
	connection.query(selectString, function(err, results) {
		
        console.log(results);
        var string=JSON.stringify(results);
        console.log(string);
        //this is a walkaround of checking if the email pass combination is 1 or not it will fail if wrong pass is given
        if (string === '[{"COUNT(email)":1}]') {
			res.redirect('/loggedin');
	
	        }
        if (string === '[{"COUNT(email)":0}]')  {
        	res.redirect('/showSignInPageretry');
        	
        }
});



});
