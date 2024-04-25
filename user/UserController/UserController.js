const User = require('../models/User');
const FileRoot = require('../../fileapi/models/FileRoot');
const crypto = require('crypto');
module.exports ={
    async createrUser(req, res) {
        try {
            const user = new User(req.body);
            //md5
            const md5Hash = crypto.createHash('md5');
            md5Hash.update(req.body.password);
            const md5HashedPassword = md5Hash.digest('hex');
            user.password = md5HashedPassword;
            await user.save();
    
            const fs = require('fs');
            const path = require('path');

            const directory = path.join(__dirname, '..', '..', 'store', 'FileStore'); // Sử dụng __dirname để lấy thư mục hiện tại của tệp script
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
    
            const fileRoot = new FileRoot({
                fileName: req.body.name,
                fileType: 'Folder',
                filePath: folderPath,
                fileSpace: '0',
                fileIdUser: user._id,
            });
    
            await fileRoot.save();
    
            res.status(201).json({ user: user, fileRoot: fileRoot}); // Gửi cả user và fileRoot trong một đối tượng JSON
        } catch (error) {
            res.status(400).send(error);
        }
    },
    async getAllUser(req,res){
        try{
            const user = await User.find().maxTimeMS(30000);
            res.send(user);
        }catch(error){
            console.log(error)
            res.status(500).send(error);
        }
    },  
    async getUserIdByName(req, res) {
        try {
            const { username } = req.body;
            const user = await User.findOne({ username: username });
            
            if (!user) {
                return res.status(404).send("User not found");
            }
            
            res.send(user._id);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    async GetUserById(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    async deleteUserById(req,res){
        try{
            const user = await User.findByIdAndDelete(req.params.id); 
                if(!user){
                    return res.status(404).send();
                }
                res.status(200).json(user); // Trả về thông tin về người dùng đã bị xóa
        }catch(error){
            res.status(500).send(error)
        }
    }
};