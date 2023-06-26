const mongoose = require('mongoose');
const reactionSchema = require('./Reaction');
const User= require('./User');

const thoughtSchema = new mongoose.Schema({
  thoughtText: { type: String, required: true,maxLength: 280, minLength:1},
  lastAccessed: { type: Date, default: Date.now },
  createdAt:{ type: Date, default: function() {
        return new Date();
  }, get: function(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss');
  }},
  username:{type:String, required:true,},
  reactions: [reactionSchema.schema],
});

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

const handleError = (err) => console.error(err);

// Will add data only if collection is empty to prevent duplicates
Thought.find({})
  .exec()
  .then(collection => {
    if (collection.length === 0) {
      Thought.insertMany([
        { thoughtText: 'Apple', username: 'ตา' },
        { thoughtText: 'Peach', username: 'ตา' },
        { thoughtText: 'Grape', username: 'ตา' },
        { thoughtText: 'Pear', username: 'ตา' },
        { thoughtText: 'Banana', username: 'ตา' },
        { thoughtText: 'Pineapple', username: 'ตา' },
        { thoughtText: 'Mango', username: 'ตา' },
        { thoughtText: 'Lime', username: 'ตา' },
      ]).then(thoughts => {
        thoughts.forEach(thought => {
          User.findOneAndUpdate(
            { username: thought.username },
            { $push: { thoughts: thought._id } },
            { new: true }
          )
            .exec()
            .catch(err => {
              console.error('Error updating user:', err);
            });
        });
      }).catch(err => handleError(err));
    }
  });

module.exports = Thought;

