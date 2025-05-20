var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
    photo: { type: Schema.Types.ObjectId, ref: 'photo' },
    author: { type: Schema.Types.ObjectId, ref: 'user' },
    content: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('comment', commentSchema);
