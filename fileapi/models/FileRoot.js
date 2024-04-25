const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    filePath:{
        type: String,
        require: true
    },
    fileSpace: {
        type:String,
        required:true
    },
    fileIdUser:{
        type:String,
        require:true
    },
});

const FileRoot = mongoose.model('FileRoot', fileSchema);

module.exports = FileRoot;
