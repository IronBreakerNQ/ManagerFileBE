const express = require('express');
const router = express.Router();
const FileController = require('./controllers/FileController');
const FileRootController = require('./controllers/FileRootControler');
const FileChange = require('./controllers/FileChangePath');
const FileDowload = require('./controllers/FileDowload');
const FileShareCrud = require('./controllers/FileShareCrud');

const FileGet = require('./controllers/FileGet');
const FileCreater = require('./controllers/FileCreate');
const FileUpload = require('./controllers/FileUpload');
const FileShare = require('./controllers/FileShare');

//get iduser
router.get('/get/getuserbuyid/:id',FileGet.findFilesById);


router.post('/create/createCheck',FileCreater.createFile);

router.post('/create',FileController.createFile);

router.get('/getRootUser',FileController.getRootUser);
router.get('/get',FileController.getAllFile);
router.get('/create/getFileByRoot/:id',FileCreater.findFilesByRoot);

router.delete('/deleteFile/:id',FileController.deleteFileById);

//share file 
router.get('/getShareFile',FileShareCrud.getAllFile);
router.get('/getShareFileBuyUser/:id',FileShareCrud.getShareFilesByUserId);

//share file 
router.post('/shareFile',FileShare.ShareFile);
router.post('/createroot',FileRootController.createFileRoot);

router.delete('/deleteRoot/:id',FileRootController.deleteFileRootById);

router.get('/getRoot',FileRootController.getAllFileRoot);
router.get('/getIdRoot/:id',FileRootController.getFileRootById)
router.get('/getFileRootBuyIdUser/:id',FileRootController.getFileRootByUserId);
//donwload 

router.get('/dowload/:id',FileDowload.downloadFile);


router.post('/post/post',FileCreater.uploadFile);
router.post('/FileUpload/Upload/:id',FileUpload.uploadFile);

// change file 
router.post('/FileChange/filechange',FileChange.changeFile);
module.exports = router;