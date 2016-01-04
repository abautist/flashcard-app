var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var port = process.env.PORT || 3000;
var expressJWT = require("express-jwt");
var jwt = require("jsonwebtoken");
var app = express();

var secret = process.env.SALT;

var Flashcard = require("./models/flashcard");

var mongoose = require("mongoose");
var User = require("./models/user");
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/flashcard");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use("/api/flashcards", expressJWT({ secret: secret }));
app.use("/api/users", expressJWT({ secret: secret })
.unless({path: ["/api/users"], method: "post"}));

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send({message: 'You need an authorization token to view this information.'})
	}
});

app.use("/api/flashcards", require("./controllers/flashcards"));
app.use("/api/users", require("./controllers/users"));

app.post("/api/auth", function(req, res) {
	User.findOne({email: req.body.email}, function(err, user) {
		if (err || !user)	return res.send({message: "User not found"});
		user.authenticated(req.body.password, function(err, result) {
			if (err || !result) return res.send({message: "User not authenticated."});

			var token = jwt.sign(user, secret);
			res.send({user: user, token: token});
		});	
	});
});

app.get("/*", function(req, res) {
	res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(port, function() {
	console.log("How many ports? " + port);
});
