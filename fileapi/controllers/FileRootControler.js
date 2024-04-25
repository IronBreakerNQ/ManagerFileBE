const FileRoot = require('../models/FileRoot');

module.exports = {
    async createFileRoot(req,res){
        try{
            const fileRoot = new FileRoot(req.body);
            await fileRoot.save();
            res.status(201).send(fileRoot); 
        }catch(error){
            res.status(400).send(error);
        }
    },

    async getAllFileRoot(req,res){
        try{
            const fileRoot = await FileRoot.find();
            res.send(fileRoot);
        }catch(error){
            console.error(error);
            res.status(500).send(error);
        }
    },

    async getFileRootById(req, res) {
      try {
        const fileRoot = await FileRoot.findById(req.params.id);
        if (!fileRoot) {
          return res.status(404).send();
        }
        res.send(fileRoot);
      } catch (error) {
        res.status(500).send(error);
      }
    },

    async getFileRootByUserId(req, res) {
      try {
        const userId = req.params.id;
        const fileRoot = await FileRoot.find({fileIdUser:userId});
        if (!fileRoot || fileRoot.length===0) {
          return res.status(404).send("no find folder");
        }
        res.send(fileRoot);
      } catch (error) {
        res.status(500).send(error);
      }
    },
    
    
  async deleteFileRootById(req, res) {
    try {
      const fileRoot = await FileRoot.findByIdAndDelete(req.params.id);
      if (!fileRoot) {
        return res.status(404).send();
      }
      res.send(fileRoot);
    } catch (error) {
      res.status(500).send(error);
    }
  }
}