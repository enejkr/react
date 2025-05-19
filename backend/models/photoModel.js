var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'description' : String,
	'path' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'views' : Number,
	'likedBy': [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	'dislikedBy': [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}]

});

module.exports = mongoose.model('photo', photoSchema);
