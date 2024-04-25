const multer = require('multer');
const path = require('path');
const fs = require('fs');

const File = require('../models/File');
const FileRoot = require('../models/FileRoot');

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
};

const checkRP = async (id, nameFile) => {
    try {
        const files = await File.find({ fileRoot: id });
        const fileNames = files.map(file => file.fileName); 

        if (fileNames.includes(nameFile)) {
            return "(copy)";
        }
        return "";
    } catch (err) {
        console.log("err" + err);
        throw err;
    }
};

// Middleware trước của multer để kiểm tra tên tệp trước khi tải lên
const preUploadMiddleware = async (req, res, next) => {
    try {
        const fileName = req.file.originalname.toLowerCase().split(' ').join('-');
        let finalFileName = fileName;
        const isDuplicate = await checkRP(req.params.id, fileName);
        if (isDuplicate) {
            finalFileName = `${isDuplicate} ${fileName}`; // Thay đổi tên file nếu trùng lặp
        }
        req.finalFileName = finalFileName; // Lưu tên file đã thay đổi vào request để sử dụng ở middleware tiếp theo
        next(); // Chuyển tiếp với tên file mới
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error: ' + error });
    }
};

// Thiết lập multer storage engine
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const filePath = await CheckFileDo(req.params.id);
            cb(null, filePath);
        } catch (error) {
            cb(error); // Trả về lỗi nếu có lỗi xảy ra
        }
    },
    filename: async function (req, file, cb) {
        try {
            const fileName = req.finalFileName || file.originalname.toLowerCase().split(' ').join('-');
            cb(null, fileName);
        } catch (error) {
            cb(error);
        }
    }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
    cb(null, true); // Chấp nhận tất cả các loại file
};

// Cấu hình multer upload
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = {
    // Middleware xử lý việc upload file
    async uploadFile(req, res) {
        try {
            // Sử dụng middleware upload.single('file') để xử lý việc tải lên file từ client
            upload.single('file')(req, res, async function (err) {
                if (err) {
                    // Xử lý lỗi nếu có
                    return res.status(400).json({
                        message: err.message
                    });
                }
                
                // Nếu không có lỗi, file đã được tải lên thành công và đang được lưu trữ tại req.file.path

                // Lấy thông tin về file đã tải lên
                const { originalname, mimetype, path } = req.file;

                // Tính toán dung lượng của tệp
                const stats = fs.statSync(path);
                const fileSizeInBytes = stats.size;
                // Chuyển đổi dung lượng thành đơn vị megabyte (MB)
                const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
                // Tạo một bản ghi mới của File
                const file = new File({
                    fileName: originalname,
                    fileType: mimetype,
                    filePath: path,
                    fileSpace: `${fileSizeInMB} MB`, // Dung lượng thực của tệp
                    fileRoot: req.params.id // ID gốc tệp, nếu cần thiết
                });

                // Lưu bản ghi vào MongoDB
                await file.save();

                return res.status(200).json({
                    message: 'File uploaded successfully',
                    filePath: req.file.path,
                    file: file
                });
            });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error: ' + error });
        }
    }
};
