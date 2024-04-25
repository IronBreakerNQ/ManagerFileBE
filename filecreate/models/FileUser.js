const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userfileSchema = new Schema({
    idRoot: {
        type: String,
        required: true
    },
    idChildren: [{
        type: String,
        required: true
    }]
});

const UserFile = mongoose.model('UserFile', userfileSchema);
module.exports = UserFile;
