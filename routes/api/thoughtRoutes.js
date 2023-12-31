const router = require('express').Router();
const {
    getThoughts,
    getThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
  } = require('../../controllers/thoughtController');

// /api/thoughts
// The post requires a thoughtText of 1-280 characters, and a username.
router.route('/').get(getThoughts).post(createThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getThought).delete(deleteThought).put(updateThought);


// /api/thoughts/:thoughtId/reactions
// posting requires a username and a  reactionBody.
// Deletion requires a post with the _id of the reaction in the body. 
router.route('/:thoughtId/reactions').post(addReaction);
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);


module.exports = router;
