const File = require('../models/File');
const fs = require('fs');
const path = require('path');

module.exports = {
    async downloadFile(req, res) {
        try {
            // Lấy thông tin về tệp từ cơ sở dữ liệu
            const file = await File.findById(req.params.id);

            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }

            const filePath = file.filePath;

            // Kiểm tra xem tệp có tồn tại không
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'File not found' });
            }
            res.download(filePath);
        } catch (error) {
            console.error('Error downloading file:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};
