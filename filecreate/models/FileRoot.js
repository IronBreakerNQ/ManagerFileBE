const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filerootfileSchema = new Schema({
    idRoot: {
        type: String,
        required: true
    },
    idChildren: [{
        type: String,
        required: true
    }]
});

const FileRootFile = mongoose.model('FileRootFile',filerootfileSchema);
module.exports = FileRootFile;
