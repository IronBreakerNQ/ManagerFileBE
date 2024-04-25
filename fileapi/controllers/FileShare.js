const FileShare = require('../models/ShareFile');
const File = require('../models/File');

module.exports ={
    async ShareFile(req,res){
        try{
          const userId = req.body.userIds;
          const fileId = req.body.fileId;
            const file = await File.findById(fileId);

            if (!file) {
                return res.status(404).json({ error: "File not found" });
            }

            const fileShare = new FileShare({
                userId : userId,
                fileId : fileId
            })

            await fileShare.save();
            return res.status(200).json({ success: true, message: "File shared successfully" });
        }catch(error){
            // Xử lý lỗi nếu có
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });

        }
    }
}