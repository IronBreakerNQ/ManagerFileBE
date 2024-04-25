const User = require('../models/User');
const FileRoot = require('../../fileapi/models/FileRoot');
const crypto = require('crypto');

module.exports = {
    async createrUser(req, res) {
        try {
            const user = new User(req.body);
            
            // Kiểm tra xem tên người dùng hoặc email đã tồn tại trong cơ sở dữ liệu hay chưa
            const existingUser = await User.findOne({ $or: [{ name: user.name }, { email: user.email }] });
            if (existingUser) {
                // Trả về mã trạng thái 409 nếu tên người dùng hoặc email đã tồn tại
                return res.status(409).send({ error: "User or email already exists" });
            }
            console.log(existingUser);

            // Nếu không có người dùng nào tồn tại với tên hoặc email tương ứng, tiếp tục tạo người dùng mới
            const md5Hash = crypto.createHash('md5');
            md5Hash.update(req.body.password);
            const md5HashedPassword = md5Hash.digest('hex');
            user.password = md5HashedPassword;
            await user.save();
    
            // Tạo thư mục cho người dùng mới
            const fs = require('fs');
            const path = require('path');
            const directory = path.join(__dirname, '..', '..', 'store', 'FileStore');
            const folderPath = path.join(directory, req.body.name);

            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true });
            }      

            try {
                fs.mkdirSync(folderPath);
                console.log('Thư mục được tạo thành công! :' + folderPath);
            } catch (error) {
                console.error('lỗi khi tạo thư mục: ', error);
            }
    
            // Tạo một "file root" cho người dùng mới
            const fileRoot = new FileRoot({
                fileName: req.body.name,
                fileType: 'Folder',
                filePath: folderPath,
                fileSpace: '0',
                fileIdUser: user._id,
            });
            await fileRoot.save();
    
            // Trả về mã trạng thái 201 và thông tin về người dùng và "file root" đã tạo
            return res.status(201).json({ user: user, fileRoot: fileRoot});
        } catch (error) {
            // Nếu có lỗi xảy ra trong quá trình xử lý, trả về mã trạng thái 400 và thông báo lỗi
            return res.status(400).send(error);
        }
    },
};
