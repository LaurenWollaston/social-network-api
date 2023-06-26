const router = require('express').Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend
  } = require('../../controllers/userController');

// /api/users/
//The post request to create a user needs a username and an email that passes regex email validation. 
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
// The update just updates whatever's in the body. Can include username and/or email. 
router.route('/:userId').get(getUser).delete(deleteUser).put(updateUser);

// /api/users/:userId/friends/friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);


module.exports = router;
