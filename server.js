var express = require("express");
var server = express();
var router = express.Router();
var fs = require("fs");
var index = fs.readFileSync(__dirname + '/index.html');

server.use('/public', express.static(__dirname + '/public'));
server.use(express.static(__dirname + '/public'));

server.get('/', function(req, res, next){
	res.end(index);
});

server.listen(3000, function(){
	console.log("To View Mappable Access: Port 3000");
});