const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

// Aggregate function to get number of users.
const userCount = async () => {
  const numberOfUsers = await User.aggregate([
    { $group: { _id: null, count: { $sum: 1 } } }
  ]);
  return numberOfUsers[0].count;
}
module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      const userObj = {
        users,
        userCount: await userCount(),
      };
      return res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single user
  async getUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .lean();
      console.log(req.params.userId)
      console.log(user)
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json({
        user,
        //We're gonna want to insert the other things like thoughts and reactions here if they're not already there. Not going to think about it until I have to cross that bridge.
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Update a user
  async updateUser(req, res){
    try{
      const user=await User.findOneAndUpdate(
        {_id: req.params.userId},
        {$set: req.body},
        {new:true}
      );
      res.json({ message: `User successfully updated with ${user}` });
    } catch (err){
      res.status(500).json(err);
    }
  },
  // Delete a thought 
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user exists with this id.' })
      }

      for (i=0;i<user.thoughts;i++){
        const thoughtForRemoval = await Thought.find(
          { _id: user.thoughts[i] },
          { $pull: { _id: user.thoughts[i] } },
          { new: true }
        );
      }

      if (user.thoughts==[]) {
        return res.status(404).json({
          message: 'This user has no thoughts.',
        });
      }

      res.json({ message: 'User successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // add friend
  async addFriend(req, res) {
    try {
      const newFriend = await User.findOne({_id: req.params.friendId});
      const user = await User.findOneAndUpdate(
        {_id: req.params.userId},
        {$push:{friends:req.params.friendId}}
        );
      res.json({ message: `${newFriend.username} added as a friend.` });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeFriend(req, res) {
    try {
      const removedFriend = await User.findOne({_id: req.params.friendId});
      const user = await User.findOneAndUpdate(
        {_id: req.params.userId},
        {$pull:{friends:req.params.friendId}}
        );
      res.json({ message: `${removedFriend.username} removed from friends.` });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
