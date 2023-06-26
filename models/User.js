const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim:true, unique:true},
  email: {type: String, required: true, unique:true, trim:true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  thoughts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thought'
  }],
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastAccessed: { type: Date, default: Date.now },
});

userSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

const User = mongoose.model('User', userSchema);

const handleError = (err) => console.error(err);

// Will add data only if collection is empty to prevent duplicates
// More than one document can have the same name value
User.find({})
  .exec()
  .then(collection => {
    if (collection.length === 0) {
      User
        .insertMany(
          [
            {username: 'ตา',email: 'Eye@mail.com'},
            { username: 'ไป', email: 'Go@mail.com' },
            { username: 'ปี', email:'Year@mail.com' },
            { username: 'พ่อ', email:'Father@mail.com' },
            { username: 'ผู้หญิง', email:'Woman@mail.com' },
            { username: 'ผู้ชาย', email:'Man@mail.com' },
            { username: 'เพื่อน', email:'Friend@mail.com' },
            { username: 'ผม', email:'Hair@mail.com'},
          ]
        )
        .catch(err => handleError(err));
    }
  });

module.exports = User;
