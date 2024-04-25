
const File = require('../models/File');
const RootUser = require('../models/FileRoot');
module.exports = {
    async createFile(req,res){
        try{
            const file = new File(req.body);
            await file.save();
            res.status(201).send(file);
        }catch(error){
            res.status(400).send(error);
        }
    },

   

    async getAllFile(req,res){
        try{
            const file = await File.find();
            res.send(file);
        }catch(error){
            console.error(error);
            res.status(500).send(error);
        }
    },

    async getRootUser(req,res){
        try{
            const rootUser = await RootUser.find();
            res.send(rootUser);
        }catch(error){
            console.error(error);
            res.status(500).send(error);
        }
    },

    async deleteFileById(req, res) {
        try {
            const file = await File.findByIdAndDelete(req.params.id);
            if (!file) {
                return res.status(404).send();
            }
            res.send(file); // Gửi lại thông tin của tệp đã bị xóa
        } catch (error) {
            res.status(500).send(error);
        }
    }
}