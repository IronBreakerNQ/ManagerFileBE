const File = require('../../fileapi/models/File');
const FileRoot = require('../../fileapi/models/FileRoot');
const RootFile = require('../models/FileRoot'); // Sửa tên biến
const FileUser = require('../models/FileUser');

const CheckFile = async (idFile) => {
    const fileRoot = await FileRoot.findById(idFile);
    return !!fileRoot;
}

const CreateComp = async (idFile, idChild, res) => { // Thêm tham số res
    if (await CheckFile(idFile)) {
        try {
            const rootFile = new RootFile({
                idRoot: idFile,
                idChildren: idChild,
            });
            await rootFile.save();
           
            res.status(201).send({ file, rootFile }); // Gửi cả hai tệp tin
        } catch (error) {
            res.status(400).send(error);
        }
    } else {
        try {
            const fileUser = new FileUser({
                idRoot: idFile,
                idChildren: idChild,
            })
            await fileUser.save();
            res.status(201).send({ file, fileUser }); // Gửi cả hai tệp tin
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

module.exports = {
    async createFile(req, res) {
        try {
            const file = new File(req.body);
            await file.save();

            const fs = require('fs');
            const path = require('path');

            const directory = file.filePath; // Sử dụng __dirname để lấy thư mục hiện tại của tệp script
            const folderPath = path.join(directory, req.body.fileName);

            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true });
            }      

            try {
                fs.mkdirSync(folderPath);
                console.log('Thư mục được tạo thành công! :' + folderPath);
            } catch (error) {
                console.error('lỗi khi tạo thư mục: ', error);
            }

            await CreateComp(req.body.idCheck, file._id, res); // Truyền thêm tham số res
        } catch (error) {
            res.status(400).send(error);
        }
    },

    async getAllFile(req,res){
        try{
            const file = await File.find();
            res.send(file);
        }catch(error){
            console.log(error);
            res.status(500).send(error);
        }
    }
}
