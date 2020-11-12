const Multer = require('multer');

const upload = Multer({
    storage: Multer.memoryStorage(),
});
module.exports = upload;