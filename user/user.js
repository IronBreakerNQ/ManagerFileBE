const express = require('express');
const router = express.Router();

const UserController = require('./UserController/UserController');
const UserLogginController = require('./UserController/UserLogginController');
const UserRessgiter = require('./UserController/UserRessiter');

router.get('/NameId',UserController.getUserIdByName);

router.get('/getBuyId/:id',UserController.GetUserById);
router.get('/getall',UserController.getAllUser);
router.post('/getLogin',UserLogginController.CreaterLogin);

router.post('/create',UserRessgiter.createrUser);
router.delete('/delete/:id',UserController.deleteUserById);

module.exports = router;