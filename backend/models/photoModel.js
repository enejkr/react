var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
	'name': String,
	'message': String,
	'path': String,
	'postedBy': {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	'likes': { type: Number, default: 0 },
	'dislikes': { type: Number, default: 0 },
	'votedBy': [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	'date': { type: Date, default: Date.now },
	'reports': { type: Number, default: 0 },
	'reportedBy': [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}]
});

module.exports = mongoose.model('photo', photoSchema);
