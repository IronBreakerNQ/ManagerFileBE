const User = require('../models/User');
const FileRoot = require('../../fileapi/models/FileRoot');
const crypto = require('crypto');
module.exports = {
    async CreaterLogin(req, res) {
        try {
            const { email, password } = req.body; // Lấy email và password từ body

            //md5
            const md5Hash = crypto.createHash('md5');
            md5Hash.update(password);
            const md5HashedPassword  = md5Hash.digest('hex');

            const user = await User.findOne({ email, password:md5HashedPassword }); // Tìm kiếm người dùng theo email và password
            if (user) {
                res.status(200).json(user); // Gửi dữ liệu người dùng nếu tìm thấy
            } else {
                res.status(404).json({ error: 'User not found' }); // Gửi thông báo lỗi nếu không tìm thấy người dùng
            }
        } catch (error) {
            res.status(500).json({ error: error.message }); // Gửi thông báo lỗi nếu có lỗi xảy ra
        }
    },
};
