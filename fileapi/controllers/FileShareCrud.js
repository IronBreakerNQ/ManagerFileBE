const FileShare = require('../models/ShareFile');
module.exports = {
    async getAllFile(req,res){
        try{
            const fileShare =await FileShare.find();
            res.send(fileShare);
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },  

    async getShareFilesByUserId(req, res) {
        try {
            const userId = req.params.id; // Lấy userId từ đường dẫn hoặc từ request body
    
            // Tìm tất cả các ShareFile có userId chứa userId đã nhập
            const fileShare = await FileShare.find({ userId: { $in: userId } });
    
            if (fileShare.length > 0) {
                // Nếu tìm thấy ShareFile, gửi danh sách chúng như là phản hồi
                res.send({ fileShare });
            } else {
                // Nếu không tìm thấy ShareFile, gửi thông báo không tìm thấy
                res.status(404).send({ message: 'fileShare not found for the given userId' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    }
    
}