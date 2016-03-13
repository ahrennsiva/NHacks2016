var express = require("express");
var app = express();

var port = process.env.PORT || 8080;
app.set('view engine', 'ejs');
var router = express.Router();
var fs = require("fs");
var index = fs.readFileSync(__dirname + '/index.html');

app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next){
	res.end(index);
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});