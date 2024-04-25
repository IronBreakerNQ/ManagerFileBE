const File = require('../models/File');
module.exports ={
async findFilesById(req,res){
    try {
        const userId = req.params.id;

        const files = await File.findById( userId );
        res.status(200).send({ files: files, message: "Files found successfully" });
    } catch (error) {
        console.error('Lỗi khi tìm kiếm các tệp theo fileRoot:', error);
        res.status(400).send({ error: error.message });
    }
}

};