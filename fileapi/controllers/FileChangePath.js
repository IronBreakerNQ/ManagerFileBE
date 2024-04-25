const File = require('../models/File');
const FileRoot = require('../models/FileRoot');
const fs = require('fs');
const path = require('path');
const CheckFile = async (idFile) => {
    const fileRoot = await FileRoot.findById(idFile);
    return !!fileRoot;
};


const CheckFileDo = async (idFile) => {
    if (await CheckFile(idFile) === true) {
        try {
            const fileRoot = await FileRoot.findById(idFile);

            return fileRoot.filePath;
        } catch (error) {
            throw error;
        }
    } else {
        try {
            const file = await File.findById(idFile);
            return file.filePath;
        } catch (error) {
            throw error;
        }
    }
}

/*
const CheckFileDo = async (idFile) => {
    let filePath;
    if (await CheckFile(idFile) === true) {
        try {
            const fileRoot = await FileRoot.findById(idFile);
            filePath = fileRoot.filePath;
        } catch (error) {
            throw error;
        }
    } else {
        try {
            const file = await File.findById(idFile);
            filePath = file.filePath;
        } catch (error) {
            throw error;
        }
    }

    // Kiểm tra quyền truy cập vào tệp tin
    try {
        await fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
        console.log('Có quyền truy cập và đọc/ghi vào tệp tin:', filePath);
    } catch (err) {
        console.error('Không thể truy cập hoặc đọc/ghi vào tệp tin:', filePath, err);
    }

    return filePath;
}

*/
/*cd
const checkRP = async (id,nameFile) =>{
    try{
        const files = await File.find({ fileRoot: id });
        const fileNames = files.map(file => file.fileName); 
        if(fileNames.includes(nameFile)){
            return "(coppy)";
        }
        return "";
    }catch(err){
        console.log("err" + err);
        throw err; // Ném lỗi để bắt ở nơi gọi hàm
    }
}
*/
const changeFile = async (FileName, oldPath, newPath) => {
    try {


        // Tạo tên mới bằng cách thêm FileName vào FileNameNew
        const FileNameNew = FileName;

        // Tạo đường dẫn mới cho tệp trong thư mục đích
        const newFilePath = path.join(newPath, FileNameNew);

        // Thực hiện đổi tên tệp
        await fs.promises.rename(oldPath, newFilePath);

        // Trả về đường dẫn mới của tệp
        return newFilePath;
    } catch (err) {
        console.log("err" + err);
        throw err; // Ném lỗi để bắt ở nơi gọi hàm
    }
}


module.exports = {
    async changeFile(req, res) {
        try {
            const fileId = req.body.IdPath; 
            const fileNewId =req.body.IdPathNew;

            const oldPath = await CheckFileDo(fileId);
            const newPath = await CheckFileDo(fileNewId);
           

            const file = await File.findById(fileId);
            const fileName = file.fileName;

            const filenew = await File.findById(fileNewId);
            const filenewName = filenew.fileName;

            
            const FilePathchange = await changeFile(fileName,oldPath,newPath);

            // Cập nhật đường dẫn của tệp trong cơ sở dữ liệu với đường dẫn mới
            await File.updateOne(
                { _id: fileId },
                { $set: { filePath: FilePathchange,fileRoot:fileNewId } }
            );

            // Trả về thông tin về tệp đã được cập nhật
            const updatedFile = await File.findById(fileId);
            return res.status(200).json(updatedFile);
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error: " + error.message
            });
        }
    }
};
