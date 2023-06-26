// ObjectId() method for converting studentId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { User, Thought, Reaction } = require('../models');

// TODO: Create an aggregate function to get the number of thoughts overall
const thoughtCount = async () => {
  const numberOfThoughts = await Thought.aggregate([
    { $group: { _id: null, count: { $sum: 1 } } }
  ]);
  return numberOfThoughts[0].count;
}
module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      const thoughtObj = {
        thoughts,
        thoughtCount: await thoughtCount(),
      };
      return res.json(thoughtObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .lean();
      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json({
        thought,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const { username, thoughtText } = req.body;
      const thought = await Thought.create({username, thoughtText});
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Update a thought
  async updateThought(req, res){
    try{
      const thought=await Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$set: req.body},
        {new:true},
      );
      res.json({ message: `Thought thunk as ${thought}`});
    } catch (err){
      res.status(500).json(err);
    }
  },
  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought exists with this id.' })
      }

      res.json({ message: 'Thought forgotten' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // add reaction
  async addReaction(req, res) {
    try {
        const { username, reactionBody } = req.body;
        const reactedThought = await Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            { $push: { reactions: { username, reactionBody } } },
        );
        res.json({ message: `Reaction added.` });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async removeReaction(req, res) {
    try {
      const reactedThought = await Thought.findOneAndUpdate(
        {_id: req.params.thoughtId},
        {$pull:{thoughts:{_id: req.body}}}
        );
      res.json({ message: `Reaction removed.` });
    } catch (err) {
      res.status(500).json(err);
    }
  },

};
