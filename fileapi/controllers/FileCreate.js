    const multer = require('multer');
    const path = require('path'); // Thêm import cho mô-đun path
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

module.exports = {
    async createFile(req, res) {
        try {
            const filePath = await CheckFileDo(req.body.idCheck);
            const file = new File({
                fileName: req.body.fileName,
                fileType: req.body.fileType,
                filePath: filePath + "\\" + req.body.fileName, // Gán đường dẫn được trả về từ hàm CheckFileDo
                fileSpace: req.body.fileSpace,
                fileRoot: req.body.idCheck
            });
            await file.save();

            const fs = require('fs');
            const path = require('path');

            const directory = filePath; // Sử dụng __dirname để lấy thư mục hiện tại của tệp script
            const folderPath = path.join(directory, req.body.fileName);


            try {
                fs.mkdirSync(folderPath);
                console.log('Thư mục được tạo thành công! :' + folderPath);
            } catch (error) {
                console.error('lỗi khi tạo thư mục: ', error);
            }

            res.status(201).send("File created successfully");
        } catch (error) {
            res.status(400).send(error);
        }
    },

    async findFilesByRoot(req,res){
        try {
            const userId = req.params.id;

            const files = await File.find({ fileRoot: userId });
            res.status(200).send({ files: files, message: "Files found successfully" });
        } catch (error) {
            console.error('Lỗi khi tìm kiếm các tệp theo fileRoot:', error);
            res.status(400).send({ error: error.message });
        }
    },

    async uploadFile(req, res) {
        const storage = multer.diskStorage({
            destination: async function (req, file, cb) {
                const filePath = await CheckFileDo(req.body['field_name']);
                cb(null, filePath); // Thư mục đích
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname); // Giữ nguyên tên tệp tin
            }
        });
        const upload = multer({ storage: storage }).single('file'); // Sử dụng .single('file') để chỉ cho phép tải lên một tệp duy nhất

        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).send(err);
            } else if (err) {
                return res.status(500).send(err);
            }
            
            try {
                const file = new File({
                    fileName: req.file.originalname,
                    fileType: path.extname(req.file.originalname), // Lấy loại tệp tin từ phần mở rộng
                    filePath: req.file.path, // Đường dẫn tuyệt đối đến tệp tin
                    fileSpace: req.file.size, // Kích thước của tệp tin
                    fileRoot: req.body.fileRoot // ID của thư mục gốc
                });
                await file.save();
                res.status(201).send("File uploaded successfully");
            } catch (error) {
                res.status(400).send(error);
            }
        });
    }
};
