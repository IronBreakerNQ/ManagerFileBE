const express = require('express');
const router = express.Router();

const FileCreate = require('./FileUserController/FileCreate');
const FileUserController = require('./FileUserController/FileUserController');

router.get('/getAllFile',FileCreate.getAllFile);

router.get('/getRoot',FileUserController.getAllFileRoot);
router.get('/getFile',FileUserController.getAllFile);

router.post('/create',FileCreate.createFile);

router.delete('/delete/root/:id',FileUserController.DeleteFileRoot);
router.delete('/delete/File/:id',FileUserController.DeleteFile);


module.exports = router;
