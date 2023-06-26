const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  reactionId: { type: mongoose.Schema.Types.ObjectId, default: ObjectId,},
  reactionBody: {type: String, max:280, required:true,},
  username: {type: String, required: true},
  lastAccessed: { type: Date, default: Date.now },
  createdAt:{ type: Date, default: function() {
        return new Date();
  }, get: function(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }},
});


const Reaction = mongoose.model('Reaction', reactionSchema);

const handleError = (err) => console.error(err);

module.exports = Reaction;

