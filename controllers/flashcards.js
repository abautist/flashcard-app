var express = require("express");
var Flashcard = require("../models/flashcard");
var router = express.Router();

router.route("/")
	.get(function(req, res) {
		Flashcard.find(function(err, flashcards) {
			if (err) return res.status(500).send(err);
			res.send(flashcards);
		});
	})
	.post(function(req, res) {
		Flashcard.create(req.body, function(err, flashcard) {
			if (err) return res.status(500).send(err);
			res.send(flashcard);
		});
	});

router.route("/:id")
	.get(function(req, res) {
		Flashcard.findById(req.params.id, function(err, flashcard) {
			if (err) return res.status(500).send(err);
			res.send(flashcard);
		});
	})
	.put(function(req, res) {
		console.log(req.body);
		Flashcard.findByIdAndUpdate(req.params.id, req.body, function(err, flashcard) {
			if (err) return res.status(500).send(err);
			res.send({'message': 'success'});
		});
	})
	.delete(function(req, res) {
		Flashcard.findByIdAndRemove(req.params.id, function(err, flashcard) {
			if (err) return res.status(500).send(err);
			res.send({'message': 'success'});
		});
	});

	module.exports = router;