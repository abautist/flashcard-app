var mongoose = require("mongoose");

var FlashcardSchema = new mongoose.Schema({
	front: String,
	back: String,
	image: String,
	category: String
});

module.exports = mongoose.model("Flashcard", FlashcardSchema);

