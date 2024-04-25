const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShareFileSchema = new Schema({
    userId: {
        type: [String],
        required: true
    },
    fileId:{
        type:String,
        require: true
    },
});

const ShareFile = mongoose.model('ShareFile', ShareFileSchema);

module.exports = ShareFile;