const RootFile = require('../models/FileRoot'); // Sửa tên biến
const FileUser = require('../models/FileUser');

module.exports ={
    async getAllFileRoot(req,res){
        try{
            const rootFile = await RootFile.find();
            res.send(rootFile);
        }catch(error){
            console.log(error);
            res.status(500).send(rootFile);
        }
    },

    async getAllFile(req,res){
        try{
            const fileUser = await FileUser.find();
            res.send(fileUser);
        }catch(error){
            console.log(error);
            res.status(500).send(fileUser);
        }
    },

    async DeleteFileRoot(req,res){
        try {
            const rootFile = await RootFile.findByIdAndDelete(req.params.id);
            if (!rootFile) {
                return res.status(404).send();
            }
            res.send(rootFile); // Gửi lại thông tin của tệp đã bị xóa
        } catch (error) {
            res.status(500).send(error);
        }
    },

    async DeleteFile(req,res){
        try {
            const fileUser = await FileUser.findByIdAndDelete(req.params.id);
            if (!fileUser) {
                return res.status(404).send();
            }
            res.send(fileUser); // Gửi lại thông tin của tệp đã bị xóa
        } catch (error) {
            res.status(500).send(error);
        }
    }
}