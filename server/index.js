const express = require('express')
const path = require('path')
const mongo = require('mongodb')
const bodyParser = require('body-parser')
const crypto = require('crypto')

const app = express();
const db = "mongodb://localhost:27017/bmi"

app.get('/',function(req,res){
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/client/app/index.html');
}).listen(3000);

console.log("Server listening at : 3000");
app.use('/client/app', express.static(__dirname + '/client/app'));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
	extended: true
}));

// Sign-up function 
app.post('/sign_up' ,function(req,res) {
	var name = req.body.name;
	var password = req.body.password;	

	var data = {
		"name":name,
		"password": password, 
	}
	
	mongo.connect(db , function(error , db){
		if (error){
			throw error;
		}
		console.log("connected to database successfully")
		//CREATING A COLLECTION IN MONGODB USING NODE.JS
		db.collection("users").insertOne(data, (err , collection) => {
			if(err) throw err;
			console.log("Record inserted successfully")
			console.log(collection);
		})
	})
	
	console.log("DATA is " + JSON.stringify(data) )
	res.set({
		'Access-Control-Allow-Origin' : '*'
	});
	return res.redirect('/client/app/bmi.html')

})

